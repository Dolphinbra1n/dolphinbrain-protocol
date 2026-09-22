# Dolphin Brain — Tokenomics

*This document describes the proposed token structure. No contract is deployed yet, so nothing below is live — it's the plan the eventual deployment is expected to follow. If the final structure differs, this document will be updated to match the deployed contract, not the other way around.*

## Summary

| Property | Proposed value |
|---|---|
| Chain | Robinhood Chain (chain ID 4663) |
| Standard | Fungible token, no unusual transfer restrictions |
| Mint function | Disclosed at deployment, if any |
| Contract address | Not yet deployed — see [README](../README.md) |

## Proposed distribution

The intent is a distribution that favors long-term liquidity and community access over insider allocation:

| Allocation | Share | Purpose |
|---|---|---|
| Public liquidity | 70% | Seeded into the primary liquidity pool at launch |
| Community & ecosystem | 15% | Incentives, contributor grants, future community programs |
| Development reserve | 10% | Ongoing infrastructure, audits, tooling |
| Team | 5% | Subject to a vesting schedule published at deployment |

These figures are a design target, not a committed allocation — they will be finalized and locked at contract deployment, at which point this table will be replaced with the actual on-chain distribution and a link to the deployment transaction.

## Liquidity

No liquidity pool exists yet. The plan is to seed the primary pool at deployment using the public liquidity allocation above, and to avoid removing liquidity in a way that isn't disclosed in advance.

## Vesting

Any team or contributor allocation that carries a vesting schedule will have its lock contract address published alongside the token contract address — not asserted in prose without an on-chain reference.

## Why publish a proposal before there's a contract

Because the alternative is either staying silent (which reads as having nothing to say) or announcing numbers as final before they're locked in code (which is how projects end up walking back commitments). This document is meant to be checked against the real contract once one exists, not treated as a promise in itself.
