import { readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import { execFileSync } from "node:child_process";

type InventoryFile = {
    path: string;
    category: string;
    extension: string;
};

const ROOT = resolve(process.cwd());
const REPORT_DIR = resolve(ROOT, "security-agent", "reports");

const IGNORED_DIRECTORIES = new Set([
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    "out",
    ".turbo",
    ".vercel",
    "playwright-report",
    "test-results",
]);

// Only inventory source, configuration and documentation files.
// The scanner does not open or read their contents.
const ALLOWED_EXTENSIONS = new Set([
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".json", ".yml", ".yaml", ".md", ".sql",
    ".prisma", ".html", ".css", ".scss",
    ".sh", ".ps1", ".toml", ".xml", ".txt",
]);

const SPECIAL_FILES = new Set([
    "Dockerfile",
    "Makefile",
    ".gitignore",
    ".dockerignore",
]);

const MAX_FILES = 12000;
const MAX_DEPTH = 18;

function isSensitiveName(name: string): boolean {
    return (
        /^\.env($|\.)/i.test(name) ||
        /(^|[._-])(id_rsa|id_ed25519|credentials|secrets?)([._-]|$)/i.test(name) ||
        /\.(pem|key|p12|pfx|keystore)$/i.test(name)
    );
}

function classifyFile(filePath: string): string {
    const path = filePath.toLowerCase();

    if (/\/api\/.*\/route\.(ts|js)$/.test(path)) return "api-route";
    if (/auth|login|register|session|token|middleware/.test(path)) return "authentication";
    if (/database|(^|\/)db\.|prisma|schema|migration|\.sql$/.test(path)) return "database";
    if (/upload|storage|file/.test(path)) return "file-handling";
    if (/admin|role|permission|authorize/.test(path)) return "authorization";
    if (/test|spec|playwright|jest|vitest/.test(path)) return "testing";
    if (/package\.json|next\.config|tsconfig|\.github|\.yml$|\.yaml$/.test(path)) return "configuration";

    return "other";
}

function getGitInformation() {
    try {
        const branch = execFileSync(
            "git",
            ["branch", "--show-current"],
            { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
        ).trim();

        const rawStatus = execFileSync(
            "git",
            ["status", "--short", "--untracked-files=all"],
            { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
        );

        const safeStatus = rawStatus
            .split(/\r?\n/)
            .filter(Boolean)
            .filter((line) => !isSensitiveName(line.slice(3).trim().split(/[\\/]/).pop() ?? ""));

        return {
            branch,
            changedFileCount: safeStatus.length,
            changedFiles: safeStatus,
        };
    } catch {
        return {
            branch: "unavailable",
            changedFileCount: 0,
            changedFiles: [],
        };
    }
}

async function scanDirectory(
    directory: string,
    results: InventoryFile[],
    depth = 0
): Promise<void> {
    if (depth > MAX_DEPTH || results.length >= MAX_FILES) return;

    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        if (results.length >= MAX_FILES) break;

        const absolutePath = resolve(directory, entry.name);
        const relativePath = relative(ROOT, absolutePath).replace(/\\/g, "/");

        if (entry.isDirectory()) {
            if (
                IGNORED_DIRECTORIES.has(entry.name) ||
                relativePath === "security-reports/archives/pre-remediation-backup"
            ) continue;
            if (relativePath === "security-agent/reports") continue;

            await scanDirectory(absolutePath, results, depth + 1);
            continue;
        }

        if (!entry.isFile() || isSensitiveName(entry.name)) continue;

        const extension = extname(entry.name).toLowerCase();

        if (
            !ALLOWED_EXTENSIONS.has(extension) &&
            !SPECIAL_FILES.has(entry.name)
        ) {
            continue;
        }

        results.push({
            path: relativePath,
            category: classifyFile(relativePath),
            extension: extension || "(no extension)",
        });
    }
}

async function main(): Promise<void> {
    console.log("Starting read-only project inventory...");
    console.log(`Project: ${ROOT}`);

    const files: InventoryFile[] = [];

    await scanDirectory(ROOT, files);

    const categoryCounts: Record<string, number> = {};

    for (const file of files) {
        categoryCounts[file.category] =
            (categoryCounts[file.category] ?? 0) + 1;
    }

    const report = {
        reportType: "project-inventory",
        generatedAt: new Date().toISOString(),
        projectRoot: ROOT,
        mode: "read-only",
        fileContentsRead: false,
        secretsCollected: false,
        fileLimitReached: files.length >= MAX_FILES,
        totalFilesInventoried: files.length,
        categoryCounts,
        git: getGitInformation(),
        files,
    };

    await mkdir(REPORT_DIR, { recursive: true });

    const reportPath = resolve(REPORT_DIR, "project-inventory.json");

    await writeFile(
        reportPath,
        JSON.stringify(report, null, 2),
        "utf8"
    );

    console.log("\nInventory completed.");
    console.log(`Files inventoried: ${files.length}`);
    console.log(`Report: ${relative(ROOT, reportPath)}`);
    console.log("\nCategory counts:");

    for (const [category, count] of Object.entries(categoryCounts)) {
        console.log(`  ${category}: ${count}`);
    }
}

main().catch((error: unknown) => {
    console.error("Inventory failed:", error);
    process.exitCode = 1;
});
