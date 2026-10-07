export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_MB = Number(import.meta.env.VITE_MAX_FILE_MB) || 8;

export const ACTIVE_STATUSES = ["queued", "processing"];

export const STATUS_META = {
  queued: { label: "Queued", className: "bg-gray-100 text-gray-700" },
  processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
};
