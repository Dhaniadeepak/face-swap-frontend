import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { swapApi } from "../api/swapApi";
import { getErrorMessage } from "../api/client";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

const PAGE_SIZE = 12;

export default function SwapHistory() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await swapApi.list(1, PAGE_SIZE);
      setItems(data.items);
      setTotal(data.total);
      setPage(1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await swapApi.list(page + 1, PAGE_SIZE);
      setItems((prev) => [...prev, ...data.items]);
      setTotal(data.total);
      setPage(page + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (swap) => {
    if (!window.confirm("Delete this swap and its images?")) return;
    setDeletingId(swap.id);
    try {
      await swapApi.remove(swap.id);
      setItems((prev) => prev.filter((s) => s.id !== swap.id));
      setTotal((t) => t - 1);
      toast.success("Swap deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader text="Loading your swaps..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">History</h1>

      {items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          No swaps yet.{" "}
          <Link to="/swaps/new" className="text-indigo-600 hover:underline">
            Create your first one
          </Link>
          .
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((swap) => (
          <li key={swap.id} className="overflow-hidden rounded-lg border bg-white">
            <Link to={`/swaps/${swap.id}`}>
              <img src={swap.resultUrl || swap.targetUrl} alt="Swap preview" className="h-40 w-full object-cover" loading="lazy" />
            </Link>
            <div className="flex items-center justify-between p-3">
              <div>
                <StatusBadge status={swap.status} />
                <p className="mt-1 text-xs text-gray-500">{new Date(swap.createdAt).toLocaleString()}</p>
              </div>
              <Button
                variant="danger"
                aria-label="Delete swap"
                loading={deletingId === swap.id}
                disabled={swap.status === "processing"}
                onClick={() => handleDelete(swap)}
                className="px-2"
              >
                {deletingId !== swap.id && <Trash2 size={16} />}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {items.length < total && (
        <div className="text-center">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
