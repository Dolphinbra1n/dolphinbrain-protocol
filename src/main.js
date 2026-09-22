import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";

import { registry } from "./registry.js";
import { resolve } from "./lib/gate.js";
import { xHandleFromUrl, githubHandleFromUrl } from "./lib/links.js";
import { xIconPath, xViewBox, githubIconPath, githubViewBox } from "./lib/icons.js";

// Tries the modern Clipboard API first, falls back to a hidden textarea
// + execCommand for browsers/contexts where clipboard permission is
// unavailable (older browsers, some embedded/automated environments).
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------
// CA banner — re-reads registry.contractAddress on every render call.
// ---------------------------------------------------------------------
function renderCaBanner() {
  const el = document.getElementById("ca-banner");
  const record = registry.contractAddress;
  const state = resolve(record);

  el.classList.toggle("is-absent", !state.live);
  el.innerHTML = "";

  const label = document.createElement("span");
  label.className = "ca-banner-label";
  label.textContent = "Contract address";
  el.appendChild(label);

  const value = document.createElement("span");
  value.className = "ca-banner-value";

  if (state.live) {
    value.textContent = record.value;
    el.appendChild(value);

    const copyBtn = document.createElement("button");
    copyBtn.className = "ca-banner-copy";
    copyBtn.type = "button";
    copyBtn.textContent = "Copy address";
    copyBtn.addEventListener("click", async () => {
      const copied = await copyToClipboard(record.value);
      copyBtn.textContent = copied ? "Copied!" : "Copy failed";
      if (copied) showToast("Contract address copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy address";
      }, 2000);
    });
    el.appendChild(copyBtn);
  } else {
    value.textContent = "Contract address not yet published.";
    el.appendChild(value);
  }

  if (state.live) {
    const meta = document.createElement("span");
    meta.className = "ca-banner-meta";
    meta.textContent = `as of ${state.asOf}${state.source ? " · " + state.source : ""}`;
    el.appendChild(meta);
  }
}

// ---------------------------------------------------------------------
// Social icons — icon-only, inert until each record's status is "stated".
// ---------------------------------------------------------------------
function buildSocialIcon({ record, path, viewBox, label, handleFn }) {
  const state = resolve(record);
  const isLive = state.live;

  const el = document.createElement(isLive ? "a" : "span");
  el.className = "social-icon";
  el.setAttribute("aria-label", isLive ? `${label} (${handleFn(record.url)})` : `${label} (not yet available)`);

  if (isLive) {
    el.href = record.url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  } else {
    el.setAttribute("aria-disabled", "true");
    el.tabIndex = -1;
  }

  el.innerHTML = `<svg viewBox="${viewBox}" aria-hidden="true"><path d="${path}"/></svg>`;
  return el;
}

function renderSocialIcons() {
  const targets = document.querySelectorAll("#social-icons, #social-icons-footer");
  targets.forEach((container) => {
    container.innerHTML = "";
    container.appendChild(
      buildSocialIcon({
        record: registry.socials.x,
        path: xIconPath,
        viewBox: xViewBox,
        label: "X",
        handleFn: xHandleFromUrl,
      })
    );
    container.appendChild(
      buildSocialIcon({
        record: registry.socials.github,
        path: githubIconPath,
        viewBox: githubViewBox,
        label: "GitHub",
        handleFn: githubHandleFromUrl,
      })
    );
  });
}

// ---------------------------------------------------------------------
// Stat tiles — each reads its own registry.stats record.
// ---------------------------------------------------------------------
function renderStatTiles() {
  const el = document.getElementById("stat-tiles");
  el.innerHTML = "";
  Object.values(registry.stats).forEach((record) => {
    const state = resolve(record);
    const tile = document.createElement("div");
    tile.className = "stat-tile reveal";

    const value = document.createElement("span");
    value.className = "stat-tile-value" + (state.live ? "" : " is-absent");
    value.textContent = state.live ? record.value : "—";

    const label = document.createElement("span");
    label.className = "stat-tile-label";
    label.textContent = record.label;

    tile.appendChild(value);
    tile.appendChild(label);
    tile.title = state.live
      ? `as of ${state.asOf} · ${state.source}`
      : `not available · ${state.source}`;
    el.appendChild(tile);
  });
}

// ---------------------------------------------------------------------
// Chain card
// ---------------------------------------------------------------------
function renderChainCard() {
  const el = document.getElementById("chain-card");
  const chain = registry.chain;
  const state = resolve(chain);

  const rows = [
    ["Network name", chain.name],
    ["Chain ID (hex)", chain.chainIdHex],
    ["Chain ID (decimal)", String(chain.chainIdDecimal)],
    ["RPC endpoint", chain.rpcUrl],
  ];

  el.innerHTML = "";
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "chain-row";
    row.innerHTML = `<span class="chain-row-label">${label}</span><span class="chain-row-value">${value}</span>`;
    el.appendChild(row);
  });

  const source = document.createElement("div");
  source.className = "chain-source";
  source.textContent = `Status: ${state.status}. Source: ${state.source} (as of ${state.asOf}). This site has not independently verified these details on-chain — they are relayed as stated.`;
  el.appendChild(source);
}

// ---------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------
const FAQ = [
  {
    q: "Is there a contract address right now?",
    a: "No. The banner at the top of this page reads the same registry value the rest of the site does — when a real address is published it will appear there automatically, in full, with a copy button.",
  },
  {
    q: "Where can I follow the project?",
    a: "Nowhere official yet. The X and GitHub icons in the corner stay visible but inert until real accounts exist, so we don't point you at a placeholder link.",
  },
  {
    q: "What chain will Dolphin Brain be on?",
    a: "Robinhood Chain (chain ID 4663 / 0x1237), per a client statement dated 2026-09-02. That's a relayed statement, not something this site verified independently on-chain.",
  },
  {
    q: "Why show empty stat tiles instead of just hiding them?",
    a: "Hiding them would look like nothing is planned; making up numbers would be worse. Showing the slot as explicitly unfilled is the more honest middle ground.",
  },
];

function renderFaq() {
  const el = document.getElementById("faq-list");
  el.innerHTML = "";
  FAQ.forEach((item, i) => {
    const wrap = document.createElement("div");
    wrap.className = "faq-item reveal";

    const btn = document.createElement("button");
    btn.className = "faq-question";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = `<span>${item.q}</span><span aria-hidden="true">+</span>`;

    const answer = document.createElement("p");
    answer.className = "faq-answer";
    answer.textContent = item.a;
    answer.hidden = true;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
    });

    wrap.appendChild(btn);
    wrap.appendChild(answer);
    el.appendChild(wrap);
  });
}

// ---------------------------------------------------------------------
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

// ---------------------------------------------------------------------
// Scroll-entrance — staggers siblings sharing a parent, then reveals
// each .reveal element once it enters the viewport. Elements already
// on-screen at load (e.g. hero content) reveal immediately.
// ---------------------------------------------------------------------
function observeReveals(root = document) {
  const groups = new Map();
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    const siblings = groups.get(el.parentElement) || [];
    siblings.push(el);
    groups.set(el.parentElement, siblings);
  });
  groups.forEach((siblings) => {
    siblings.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
    });
  });

  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
}

function renderAll() {
  renderCaBanner();
  renderSocialIcons();
  renderStatTiles();
  renderChainCard();
  renderFaq();
  observeReveals();
}

renderAll();

// Expose a render hook for the gates script / manual console testing —
// editing registry.js and calling window.__dolphinBrainRender() (or just
// reloading) must be the only thing needed to flip states.
window.__dolphinBrainRender = renderAll;
