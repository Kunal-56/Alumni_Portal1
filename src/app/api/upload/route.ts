import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "events";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate image mime type
    const validMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/bmp",
      "image/avif",
    ];

    if (!validMimes.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed." },
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

    // Target directory: public/uploads/<folder>
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder || "events");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe, unique filename
    const originalExt = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const filename = `${baseName || "event"}-${uniqueId}${originalExt}`;
    const destinationPath = path.join(uploadDir, filename);

    // Write file to disk
    fs.writeFileSync(destinationPath, buffer);

    // Public URL accessible by browser and stored in database
    const publicUrl = `/uploads/${safeFolder || "events"}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      message: "Local PC image successfully uploaded and stored on server",
    });
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image file" },
      { status: 500 }
    );
  }
}

