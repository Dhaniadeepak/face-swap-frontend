import { STATUS_META } from "../constants";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.queued;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}>{meta.label}</span>;
}
