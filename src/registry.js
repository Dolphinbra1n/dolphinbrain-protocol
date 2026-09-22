/**
 * registry.js — single source of truth for every external fact this site
 * displays (contract address, social links, chain facts, any stat).
 *
 * Every record has an explicit `status`:
 *   "stated"      – a value exists and is attributed to a source
 *   "absent"      – no real value exists yet (this is the current state
 *                   for the CA and both social links)
 *   "unconfirmed" – a value exists but has not been independently verified
 *
 * UI components must read these records at *runtime* (not bake in a
 * build-time boolean) so that editing only this file — no component code —
 * flips the whole site between the "absent" and "populated" states. This is
 * the mutation-harness rule referenced in project docs: every gated UI
 * anchor (CA banner, social icons, stat tiles) re-derives its rendered
 * state from these records on every render.
 *
 * To go live: change `contractAddress.value` from null to the real 0x
 * address and flip its `status` to "stated" (same pattern for the socials).
 * Do NOT special-case the shape of the string anywhere else in the code —
 * the gate only ever checks `status`.
 */

export const registry = {
  project: {
    name: "Dolphin Brain",
    domain: "dolphinbrain.app",
  },

  chain: {
    status: "stated",
    name: "Robinhood Chain",
    chainIdHex: "0x1237",
    chainIdDecimal: 4663,
    rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
    asOf: "2026-09-02",
    source: "client statement, 2026-09-02, batch-level — not independently verified on-chain by this site",
  },

  // Contract address. `value` is the raw string or null. Never derive
  // display text from anything other than this record.
  contractAddress: {
    status: "absent",
    value: null,
    asOf: "2026-09-22",
    source: "no contract deployed / published yet",
  },

  socials: {
    x: {
      status: "stated",
      url: "https://x.com/dolphinbra1n",
      asOf: "2026-09-22",
      source: "client confirmed",
    },
    github: {
      status: "stated",
      url: "https://github.com/Dolphinbra1n/dolphinbrain-protocol",
      asOf: "2026-09-22",
      source: "client confirmed",
    },
  },

  // Example of a stat tile record. No live data feed exists yet, so this
  // stays "absent" and the UI renders it as an honest placeholder instead
  // of a fabricated number. When a real feed exists, set status to
  // "stated" (or "unconfirmed" while pending verification) and fill value.
  stats: {
    holders: {
      status: "absent",
      value: null,
      label: "Holders",
      asOf: "2026-09-22",
      source: "no indexer connected yet",
    },
    liquidity: {
      status: "absent",
      value: null,
      label: "Liquidity",
      asOf: "2026-09-22",
      source: "no liquidity pool exists yet",
    },
    chainId: {
      status: "stated",
      value: "4663",
      label: "Chain ID",
      asOf: "2026-09-02",
      source: "client statement, 2026-09-02, batch-level",
    },
  },
};

export default registry;
