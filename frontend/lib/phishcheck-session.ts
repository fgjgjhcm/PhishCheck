const STORAGE_KEY = "phishcheck_session_id";

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}

/** In-memory fallback when sessionStorage is unavailable (e.g. strict private mode). */
let memorySessionId: string | null = null;

/**
 * One id per browser tab session, persisted in sessionStorage until the tab is closed.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    if (!memorySessionId) {
      memorySessionId = generateSessionId();
    }
    return memorySessionId;
  }
}
