/**
 * gate.js — pure functions that turn a registry record into a render
 * decision. These are the ONLY place "is this thing live" is decided.
 *
 * IMPORTANT: the gate checks `record.status`, never the shape of
 * `record.value` / `record.url`. A future real contract address WILL be a
 * 0x-prefixed hex string — do not add pattern-matching here that would
 * reject it. Status is set explicitly by whoever edits registry.js.
 */

export function isLive(record) {
  return Boolean(record) && record.status === "stated";
}

/**
 * Returns a render-ready descriptor for any registry record with a
 * `value`/`url`. Components should use this rather than reading
 * `record.status` themselves, so the rule lives in exactly one place.
 */
export function resolve(record) {
  const live = isLive(record);
  return {
    live,
    status: record?.status ?? "absent",
    asOf: record?.asOf ?? null,
    source: record?.source ?? null,
  };
}
