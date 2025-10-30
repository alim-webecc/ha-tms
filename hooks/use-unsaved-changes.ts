file:frontend-v0/hooks/use-unsaved-changes.ts
"use client";

/**
 * useUnsavedChanges
 * ------------------------------------------------------------
 * Minimaler Hook, der – wenn isDirty=true – den nativen Browser-
 * Dialog beim Tab-Schließen/Reload auslöst. Signatur ist exakt
 * an deine Nutzung in /app/auftrage/neu/page.tsx angepasst:
 *
 *   useUnsavedChanges(hasUnsavedChanges)
 *
 * Es wird nichts zurückgegeben; Navigation innerhalb der App
 * intercepten wir bewusst NICHT (dafür hast du den
 * UnsavedChangesDialog auf der Seite).
 */
import { useEffect } from "react";

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      // Chrome/Edge benötigen returnValue, sonst kein Prompt.
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    if (isDirty) {
      window.addEventListener("beforeunload", onBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty]);
}
