// app/api/upload/route.ts
import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      pinataFormData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${pinataFormData.getBoundary()}`,
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
        },
      }
    );

    return NextResponse.json({ ipfsHash: response.data.IpfsHash });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
