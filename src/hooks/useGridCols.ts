"use client";

import { useSyncExternalStore } from "react";

function getCols() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1280px)").matches) return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

function subscribe(callback: () => void) {
  const queries = [
    window.matchMedia("(min-width: 1280px)"),
    window.matchMedia("(min-width: 1024px)"),
    window.matchMedia("(min-width: 640px)"),
  ];
  queries.forEach((mq) => mq.addEventListener("change", callback));
  return () =>
    queries.forEach((mq) => mq.removeEventListener("change", callback));
}

export function useGridCols() {
  return useSyncExternalStore(subscribe, getCols, () => 3);
}
