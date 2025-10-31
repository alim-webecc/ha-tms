"use client";

import { useEffect } from "react";

/**
 * Markiert die Seite als „mit ungesicherten Änderungen“,
 * indem sie einen beforeunload-Dialog des Browsers aktiviert.
 * (Die eigentliche Dialog-Komponente steuerst du separat.)
 */
export function useUnsavedChanges(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard-Dialog des Browsers aktivieren
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled]);
}
