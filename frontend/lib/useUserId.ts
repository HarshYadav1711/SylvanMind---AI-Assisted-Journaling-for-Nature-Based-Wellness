"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sylvanmind_user_id";

export function useUserId(): [string, (id: string) => void] {
  const [userId, setUserIdState] = useState("");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const env = process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? "";
    setUserIdState(stored ?? env);
  }, []);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return [userId, setUserId];
}
