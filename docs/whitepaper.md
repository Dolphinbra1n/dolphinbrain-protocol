# Dolphin Brain — Protocol Overview

*Working document. This describes intent and design direction, not audited or finalized protocol behavior.*

## 1. Premise

Meme projects usually optimize for the first ten minutes: a chart, a countdown, a reason to move fast. Dolphin Brain optimizes for the opposite — it assumes most of the people reading this are deciding whether to trust something that doesn't fully exist yet, and that the honest move is to say so plainly rather than paper over the gap with hype copy.

The dolphin is the mascot because dolphins orient by listening before acting — echolocation before motion. The project borrows that order of operations: identity and infrastructure first, a token second, and only once there's something real underneath it.

## 2. Design principles

**Absent means absent.** If a fact doesn't exist yet — a contract address, a social account, a holder count — the interface shows an explicit "not yet" state instead of a fabricated placeholder. This applies everywhere: the website, this repository, and any future dashboard.

**Facts are dated and sourced.** Anything relayed from outside the project (chain details, for instance) carries the date it was stated and who stated it, so readers can judge freshness for themselves instead of assuming everything on the page was verified today.

**One source of truth.** The live site reads every external fact — contract address, social links, chain parameters — from a single registry rather than scattering hardcoded values across pages. When a fact changes, it changes in one place, and every surface that depends on it updates automatically.

## 3. What Dolphin Brain is not

- It is not a trading signal. Nothing on the site or in this repository should be read as investment advice.
- It is not claiming an audited smart contract exists — because one doesn't yet.
- It is not affiliated with Robinhood Markets beyond deploying on the chain that carries the Robinhood Chain name, per the client statement referenced in the README.

## 4. Protocol direction

Once a contract is deployed, the intent is a standard fungible token on Robinhood Chain with no unusual transfer restrictions, no hidden mint function beyond what's disclosed at deployment, and a liquidity pool seeded transparently. Specifics (supply, initial liquidity depth, any vesting) will be published as part of the deployment announcement and reflected in [tokenomics.md](tokenomics.md) once they're real — that document currently describes the proposed structure, not a live allocation.

## 5. Community and governance

Early direction will be shaped by whoever shows up — the X account and this repository are the two channels for that. There is no formal governance token or voting mechanism planned at this stage; if that changes, it will be documented here rather than announced only in passing.

## 6. Status

This whitepaper will be revised as the project moves from "identity and infrastructure" toward "deployed contract." Check the git history of this file for what's changed and when.
