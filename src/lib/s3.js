// src/lib/s3.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = "mafazatulhayat";
const ENDPOINT = "https://s3.nexodynamix.com";
const PUBLIC_BASE = "https://s3.nexodynamix.com/" + BUCKET;

export const s3Client = new S3Client({
  endpoint: ENDPOINT,
  region: "us-east-1", // MinIO requires a region string, value doesn't matter
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "jabpod-xovsyk-9Zarno",
  },
  forcePathStyle: true, // required for MinIO
});

/**
 * Upload a File object to S3
 * @param {File} file - the file to upload
 * @param {string} folder - e.g. "doctors", "gallery", "blog"
 * @returns {Promise<string>} public URL of the uploaded file
 */
export async function uploadFile(file, folder = "general") {
  const ext = file.name.split(".").pop();
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const fileBuffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: file.type,
  });

  await s3Client.send(command);
  return `${PUBLIC_BASE}/${key}`;
}

/**
 * Delete a file from S3 by its full public URL
 * @param {string} url
 */
export async function deleteFile(url) {
  if (!url || !url.includes(PUBLIC_BASE)) return;
  const key = url.replace(`${PUBLIC_BASE}/`, "");
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3Client.send(command);
}