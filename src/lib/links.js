/**
 * Small parsers that derive a display handle from a raw URL. The registry
 * never stores a handle string separately from its URL — components call
 * these at render time so the handle can never drift out of sync with the
 * link it describes.
 */

/** "https://x.com/foo" -> "@foo". Returns null if it cannot be parsed. */
export function xHandleFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const segment = u.pathname.split("/").filter(Boolean)[0];
    return segment ? `@${segment}` : null;
  } catch {
    return null;
  }
}

/** "https://github.com/org/repo" -> "org/repo" (or "org"). Returns null if unparsable. */
export function githubHandleFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    return segments.slice(0, 2).join("/");
  } catch {
    return null;
  }
}
