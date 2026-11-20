import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { hasSameOrigin, isAuthorizedAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
    if (!(await isAuthorizedAdmin(request))) {
      return NextResponse.json({ success: false, error: "Administrator access required." }, { status: 403 });
    }
    const rate = checkRateLimit(request, "upload", 30, 5 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Upload limit reached. Please try again later." }, { status: 429 });
    }
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 16 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Upload request exceeds the size limit." }, { status: 413 });
    }
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "events";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Allowed folders allowlist to prevent arbitrary directory creation / traversal
    const ALLOWED_FOLDERS = ["events", "gallery", "news", "avatars"];
    const requestedFolder = String(folder || "").trim().toLowerCase();
    const safeFolder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : "events";

    // Strict allowed image extensions to prevent arbitrary file upload and Stored XSS
    const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    const rawExt = path.extname(file.name || "").toLowerCase();
    if (!rawExt || !ALLOWED_EXTENSIONS.includes(rawExt)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file extension. Only safe image files (JPG, PNG, WEBP, GIF, AVIF) are allowed. SVG and scripts are blocked.",
        },
        { status: 400 }
      );
    }

    // Validate safe image mime types (SVG deliberately excluded to prevent Stored XSS)
    const validMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    const mimeForExtension: Record<string, string> = {
      ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
      ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif",
    };
    if (!validMimes.includes(file.type.toLowerCase()) || mimeForExtension[rawExt] !== file.type.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only standard raster image files (JPG, PNG, WEBP, GIF, AVIF) are allowed." },
        { status: 400 }
      );
    }

    // Max 15MB size limit
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image file size exceeds the 15MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const signatures: Record<string, (data: Buffer) => boolean> = {
      ".jpg": (data) => data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
      ".jpeg": (data) => data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
      ".png": (data) => data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
      ".gif": (data) => data.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/) !== null,
      ".webp": (data) => data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP",
      ".avif": (data) => data.length >= 12 && data.subarray(4, 8).toString("ascii") === "ftyp" && ["avif", "avis"].includes(data.subarray(8, 12).toString("ascii")),
    };
    if (!signatures[rawExt](buffer)) {
      return NextResponse.json({ success: false, error: "The uploaded file content does not match its image type." }, { status: 400 });
    }

    // Target directory: public/uploads/<safeFolder> with path confinement check
    const uploadBaseDir = path.resolve(process.cwd(), "public", "uploads");
    const uploadDir = path.resolve(uploadBaseDir, safeFolder);
    if (!uploadDir.startsWith(uploadBaseDir)) {
      return NextResponse.json(
        { success: false, error: "Access denied: invalid upload directory path." },
        { status: 400 }
      );
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe, unique filename
    const originalExt = rawExt;
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueId = randomUUID();
    const filename = `${baseName || "image"}-${uniqueId}${originalExt}`;
    const destinationPath = path.resolve(uploadDir, filename);

    // Ensure destination remains strictly confined within target uploadDir
    if (!destinationPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { success: false, error: "Path traversal detected. Upload aborted." },
        { status: 400 }
      );
    }

    // Write file to disk
    fs.writeFileSync(destinationPath, buffer, { flag: "wx" });

    // Public URL accessible by browser and stored in database
    const publicUrl = `/uploads/${safeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      message: "Local PC image successfully uploaded and stored on server",
    });
  } catch (error: any) {
    console.error("POST /api/upload failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Failed to upload image file" },
      { status: 500 }
    );
  }
}

