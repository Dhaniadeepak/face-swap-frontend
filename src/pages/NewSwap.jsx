import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { swapApi } from "../api/swapApi";
import { getErrorMessage } from "../api/client";
import ImageUpload from "../components/ImageUpload";
import Button from "../components/Button";

export default function NewSwap() {
  const navigate = useNavigate();
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = source && target && consent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const swap = await swapApi.create({ source, target });
      toast.success("Swap started");
      navigate(`/swaps/${swap.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">New face swap</h1>
        <p className="text-sm text-gray-600">Upload the face to use and the image that should receive it.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUpload label="1. Face to use" hint="A clear, front-facing photo" file={source} onChange={setSource} />
        <ImageUpload label="2. Target image" hint="The photo that gets the new face" file={target} onChange={setTarget} />
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <span>I have the right to use these faces, and I will not use the result to deceive or harm anyone. Results are AI-generated.</span>
      </label>

      <Button type="submit" loading={submitting} disabled={!canSubmit}>
        <Sparkles size={16} /> Swap faces
      </Button>
    </form>
  );
}
