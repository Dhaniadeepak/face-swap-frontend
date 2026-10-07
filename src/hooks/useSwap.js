import { useCallback, useEffect, useState } from "react";
import { swapApi } from "../api/swapApi";
import { getErrorMessage } from "../api/client";
import { ACTIVE_STATUSES } from "../constants";

const POLL_MS = 2000;
const MAX_FAILURES = 3;

export function useSwap(id) {
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer;
    let failures = 0;

    const tick = async () => {
      try {
        const data = await swapApi.get(id);
        if (cancelled) return;
        failures = 0;
        setError("");
        setSwap(data);
        setLoading(false);
        if (ACTIVE_STATUSES.includes(data.status)) timer = setTimeout(tick, POLL_MS);
      } catch (err) {
        if (cancelled) return;
        failures += 1;
        if (failures < MAX_FAILURES) {
          timer = setTimeout(tick, POLL_MS);
        } else {
          setError(getErrorMessage(err));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, reloadKey]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  return { swap, loading, error, refresh };
}
