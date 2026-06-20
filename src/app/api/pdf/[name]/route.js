import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request, { params }) {
  const { name } = await params;

  const fileName = name.endsWith(".pdf") ? name : `${name}.pdf`;
  const filePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "PDF",
    fileName,
  );

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
