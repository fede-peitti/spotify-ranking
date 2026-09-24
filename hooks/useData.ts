"use client";

import { useEffect, useState } from "react";

export function useData<T>(url: string): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading };
}