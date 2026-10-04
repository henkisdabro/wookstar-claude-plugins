---
name: fifteen-factor-app
description: Fifteen-Factor App methodology - Twelve-Factor plus API First, Telemetry and Security - for cloud-native SaaS architecture. Use when designing a SaaS product or microservice, reviewing an architecture against twelve or fifteen factors, adding architecture constraints to a PRP or PRD, planning a migration of a legacy app to the cloud, or assessing architectural technical debt. Do NOT use for local-only scripts or internal tools that will never run as a service; do NOT use for writing the PRP itself - use prp-generator.
---

# Fifteen-Factor App Methodology

## Overview

The Fifteen-Factor App methodology extends the original Twelve-Factor App principles (created by Heroku in 2012) with three additional factors essential for modern cloud-native applications: API First, Telemetry, and Security.

## The Fifteen Factors at a Glance

| Factor | Principle | Key Concept |
|--------|-----------|-------------|
| I. Codebase | One codebase, many deploys | Single repo per app, version controlled |
| II. Dependencies | Explicitly declare and isolate | No implicit system-wide packages |
| III. Config | Store in environment | Never hardcode configuration |
| IV. Backing Services | Treat as attached resources | Databases, caches are swappable resources |
| V. Build, Release, Run | Strict separation | Immutable releases, no runtime changes |
| VI. Processes | Stateless and share-nothing | Horizontal scaling, no sticky sessions |
| VII. Port Binding | Export via port | Self-contained, no runtime injection |
| VIII. Concurrency | Scale out via process model | Horizontal over vertical scaling |
| IX. Disposability | Fast startup, graceful shutdown | Maximise robustness |
| X. Dev/Prod Parity | Keep environments similar | Continuous deployment |
| XI. Logs | Treat as event streams | Separate generation from processing |
| XII. Admin Processes | Run as one-off processes | Same environment as app |
| **XIII. API First** | Design contracts first | Enable parallel development |
| **XIV. Telemetry** | Monitor everything | APM, health checks, domain metrics |
| **XV. Security** | Authentication & Authorisation | RBAC, identity per request |

## Architecture Checklist

When creating a PRP, PRD, or architecture plan, evaluate the design against each factor. Use this checklist for quick validation:

```
□ Single codebase in version control
□ All dependencies explicitly declared
□ Configuration externalised to environment
□ Backing services abstracted and swappable
□ Build, release, run stages separated
□ Stateless processes (no sticky sessions)
□ Services self-contained with port binding
□ Designed for horizontal scaling
□ Fast startup and graceful shutdown
□ Dev/staging/prod environments aligned
□ Logs streamed to external aggregator
□ Admin tasks automated and reproducible
□ API contracts defined before implementation
□ Telemetry: APM, health checks, metrics
□ Security: Authentication and authorisation
```

## Resources

Detailed documentation for each factor is available in the references directory:

- `references/overview.md` - Complete factor summary with diagrams
- `references/original-factors.md` - Factors I-XII with implementation examples
- `references/modern-extensions.md` - Factors XIII-XV (API First, Telemetry, Security)
- `references/setup-and-tools.md` - Tooling recommendations and quick start

Read the appropriate reference file for detailed guidance on specific factors.
