# Contributing to Dolphin Brain

Thanks for taking a look. This project is small and early, so the bar for a useful contribution is lower than it might look from the outside — you don't need to be a Robinhood Chain expert to help.

## Ways to contribute

- **Documentation** — corrections, clarity fixes, or filling gaps in the docs under [`docs/`](../docs) are always welcome, especially anything that makes an absent/uncertain state clearer rather than papering over it.
- **Bug reports** — if something on the site or in this repository is inconsistent (a stat that should say "absent" but doesn't, a broken link, a stale date), open an issue.
- **Design and copy** — the project's voice is plain and specific rather than hype-driven; contributions that match that tone are easier to merge than ones that don't.
- **Code** — once the contract is deployed, tooling contributions (indexers, dashboards, integrations) will have a home here. Until then, most useful code contributions are to the documentation site itself.

## Ground rules

1. **No fabricated facts.** If a contribution states a number or a claim, it needs a source or it needs to be marked as a proposal, not a fact. This project's entire premise is not doing that — PRs that violate it won't be merged regardless of how good the writing is.
2. **Keep the registry pattern intact.** If your change touches how the site reads contract address, social links, or stats, it must go through the single registry — no hardcoding a fact in a component.
3. **Small, reviewable changes.** Prefer several small PRs over one large one. It's easier to say yes to a five-line doc fix than a thousand-line rewrite.
4. **Be respectful in issues and PRs.** Disagreement about direction is fine; hostility isn't.

## Submitting a change

1. Fork the repository.
2. Create a branch describing the change (`docs/fix-roadmap-typo`, not `patch-1`).
3. Make the change and open a pull request against `main` with a short description of *why*, not just *what*.
4. Be patient — this is maintained part-time in the early phase of the project.

## Reporting an issue

Open a GitHub issue with:
- What you expected
- What actually happened
- A link to the specific page or file, if applicable

## Security

If you find something that looks like a security issue (once a contract exists — this doesn't apply to the documentation site itself), do not open a public issue. Reach out via the official X account, [@dolphinbra1n](https://x.com/dolphinbra1n), for a private channel instead.
