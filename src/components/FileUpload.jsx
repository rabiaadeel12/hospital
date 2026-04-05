// src/components/FileUpload.jsx
import React, { useRef, useState } from "react";
import { uploadFile } from "../lib/s3";
import { Loader2, UploadCloud, X, FileText } from "lucide-react";

/**
 * FileUpload — drop-in upload widget for any admin form field
 *
 * Props:
 *   value       {string}   current URL (controlled)
 *   onChange    {fn}       called with new URL after upload
 *   folder      {string}   S3 sub-folder e.g. "doctors", "gallery"
 *   accept      {string}   MIME types e.g. "image/*" or "application/pdf"
 *   label       {string}   button label
 *   preview     {boolean}  show image preview (default true for images)
 *   maxMB       {number}   max file size in MB (default 10)
 */
export default function FileUpload({
  value,
  onChange,
  folder = "general",
  accept = "image/*",
  label = "Upload File",
  preview = true,
  maxMB = 10,
}) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const isImage = accept.startsWith("image");
  const isPDF = accept.includes("pdf");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");

    // Size check
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large. Max size is ${maxMB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, folder);
      onChange(url);
    } catch (e) {
      console.error(e);
      setError("Upload failed. Check your connection or file type.");
    } finally {
      setUploading(false);
    }
  };

  const handleInput = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition px-4 py-5
          ${dragging ? "border-teal-400 bg-teal-500/10" : "border-white/10 bg-white/5 hover:border-teal-500/50 hover:bg-white/10"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInput}
        />

        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-teal-400" />
            <span className="text-xs text-gray-400">Uploading…</span>
          </>
        ) : (
          <>
            <UploadCloud size={22} className="text-gray-500" />
            <span className="text-xs text-gray-400">
              {label} <span className="text-teal-400 underline">or drag & drop</span>
            </span>
            <span className="text-[10px] text-gray-600">Max {maxMB}MB</span>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Preview / current value */}
      {value && (
        <div className="relative group">
          {isImage && preview ? (
            <img
              src={value}
              alt="Upload preview"
              className="w-full max-h-48 object-cover rounded-lg border border-white/10"
            />
          ) : (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <FileText size={14} className="text-teal-400 shrink-0" />
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-400 hover:underline truncate"
              >
                {value.split("/").pop()}
              </a>
            </div>
          )}

          {/* Clear button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}