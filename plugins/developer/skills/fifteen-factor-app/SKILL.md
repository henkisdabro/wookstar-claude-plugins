---
name: fifteen-factor-app
description: Fifteen-Factor App methodology - Twelve-Factor plus API First, Telemetry and Security - for cloud-native SaaS architecture. Use when designing a SaaS product or microservice, reviewing an architecture against twelve or fifteen factors, adding architecture constraints to a PRP or PRD, planning a migration of a legacy app to the cloud, or assessing architectural technical debt. Do NOT use for local-only scripts or internal tools that will never run as a service; do NOT use for writing the PRP itself - use prp-generator.
---

# Fifteen-Factor App

The Twelve-Factor App principles plus API First (XIII), Telemetry (XIV) and Security (XV).

Evaluate the design - a PRP, PRD, architecture plan or existing app - against every factor:

```
□ I. Codebase - single codebase in version control, many deploys
□ II. Dependencies - all explicitly declared and isolated
□ III. Config - externalised to the environment
□ IV. Backing services - attached resources, abstracted and swappable
□ V. Build, release, run - stages separated, releases immutable
□ VI. Processes - stateless and share-nothing (no sticky sessions)
□ VII. Port binding - services self-contained, exported via port
□ VIII. Concurrency - designed for horizontal scaling
□ IX. Disposability - fast startup and graceful shutdown
□ X. Dev/prod parity - dev, staging and prod environments aligned
□ XI. Logs - event streams sent to an external aggregator
□ XII. Admin processes - one-off, automated and reproducible, in the app's environment
□ XIII. API First - contracts defined before implementation
□ XIV. Telemetry - APM, health checks, domain metrics
□ XV. Security - authentication and authorisation, identity per request
```

Done when each of the fifteen is marked met, gap or not applicable, with the evidence or the reason.

## References

- [references/original-factors.md](references/original-factors.md) - when a factor from I-XII needs its detail or an implementation example.
- [references/modern-extensions.md](references/modern-extensions.md) - the same for XIII-XV.
- [references/overview.md](references/overview.md) - when designing from scratch: the factors grouped into categories and a phased list of decision questions.
- [references/setup-and-tools.md](references/setup-and-tools.md) - when a starter configuration is needed: stack dependencies, Dockerfile and Compose, Kubernetes, CI, OpenTelemetry and Prometheus, `.env.example`.
