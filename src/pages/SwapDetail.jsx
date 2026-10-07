import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { swapApi } from "../api/swapApi";
import { getErrorMessage } from "../api/client";
import { useSwap } from "../hooks/useSwap";
import { downloadImage } from "../utils/download";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

function Photo({ title, url }) {
  return (
    <figure className="space-y-1">
      <img src={url} alt={title} className="h-56 w-full rounded-lg border bg-white object-contain" />
      <figcaption className="text-center text-xs text-gray-500">{title}</figcaption>
    </figure>
  );
}

export default function SwapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { swap, loading, error, refresh } = useSwap(id);
  const [busy, setBusy] = useState("");

  const run = async (name, action) => {
    setBusy(name);
    try {
      await action();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy("");
    }
  };

  const handleRetry = () =>
    run("retry", async () => {
      await swapApi.retry(id);
      toast.success("Retrying");
      refresh();
    });

  const handleDelete = () => {
    if (!window.confirm("Delete this swap and its images?")) return;
    run("delete", async () => {
      await swapApi.remove(id);
      toast.success("Swap deleted");
      navigate("/swaps");
    });
  };

  const handleDownload = () => run("download", () => downloadImage(swap.resultUrl, `faceswap-${id}.png`));

  if (loading) return <Loader text="Loading swap..." />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  const inProgress = swap.status === "queued" || swap.status === "processing";

  return (
    <div className="space-y-6">
      <div>
        <Link to="/swaps" className="mb-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600">
          <ArrowLeft size={16} /> Back to history
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Face swap</h1>
          <StatusBadge status={swap.status} />
        </div>
      </div>

      {inProgress && (
        <div className="flex items-center gap-3 rounded-lg border bg-white p-4 text-sm text-gray-700">
          <Loader2 className="animate-spin text-indigo-600" size={20} />
          <div>
            <p className="font-medium">{swap.status === "queued" ? "Waiting in the queue..." : "Swapping faces..."}</p>
            <p className="text-gray-500">This usually takes under a minute. You can leave this page and come back from History.</p>
          </div>
        </div>
      )}

      {swap.status === "failed" && (
        <ErrorState message={swap.errorMessage || "This swap failed."} onRetry={handleRetry} retryLabel={busy === "retry" ? "Retrying..." : "Retry with the same images"} />
      )}

      {swap.status === "completed" && swap.resultUrl && (
        <div className="space-y-3">
          <div className="relative">
            <img src={swap.resultUrl} alt="Result" className="mx-auto max-h-[28rem] rounded-lg border bg-white object-contain" />
            <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">AI-generated</span>
          </div>
          <div className="text-center">
            <Button onClick={handleDownload} loading={busy === "download"}>
              <Download size={16} /> Download
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Photo title="Face used" url={swap.sourceUrl} />
        <Photo title="Target image" url={swap.targetUrl} />
      </div>

      <Button variant="danger" onClick={handleDelete} loading={busy === "delete"} disabled={swap.status === "processing"}>
        <Trash2 size={16} /> Delete
      </Button>
    </div>
  );
}
