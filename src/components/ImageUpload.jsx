import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { ACCEPTED_TYPES, MAX_FILE_MB } from "../constants";

export default function ImageUpload({ label, hint, file, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const choose = (picked) => {
    if (!picked) return;
    if (!ACCEPTED_TYPES.includes(picked.type)) return setError("Use a JPG, PNG or WebP image");
    if (picked.size > MAX_FILE_MB * 1024 * 1024) return setError(`Image must be under ${MAX_FILE_MB} MB`);
    setError("");
    onChange(picked);
  };

  const clear = () => {
    setError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>

      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          choose(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex h-56 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-white text-center ${
          dragging ? "border-indigo-500 bg-indigo-50" : error ? "border-red-400" : "border-gray-300"
        } ${file ? "" : "cursor-pointer hover:border-indigo-400"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={clear}
              aria-label={`Remove ${label}`}
              className="absolute right-2 top-2 rounded-full bg-white p-1 shadow hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="px-4 text-gray-500">
            <ImagePlus className="mx-auto mb-2" />
            <p className="text-sm">Click or drag an image here</p>
            <p className="mt-1 text-xs">{hint}</p>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={(e) => choose(e.target.files?.[0])} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
