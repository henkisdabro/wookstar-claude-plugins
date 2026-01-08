---
name: fifteen-factor-app
description: The Fifteen-Factor App methodology for modern cloud-native SaaS applications. This skill should be automatically invoked when planning SaaS tools, product software architecture, microservices design, PRPs/PRDs, or cloud-native application development. Extends the original Twelve-Factor App principles with three additional factors (API First, Telemetry, Security). Trigger keywords include "fifteen factor", "12 factor", "SaaS architecture", "cloud-native design", "application architecture", "microservices best practices", or when in a planning/architecture session.
user-invocable: false
---

# Fifteen-Factor App Methodology

## Overview

The Fifteen-Factor App methodology extends the original Twelve-Factor App principles (created by Heroku in 2012) with three additional factors essential for modern cloud-native applications: API First, Telemetry, and Security.

This methodology provides architectural principles and guidelines for building software-as-a-service applications that are:

- **Performant** - Optimised for speed and efficiency
- **Scalable** - Designed for horizontal scaling without significant changes
- **Manageable** - Easy to deploy, monitor, and maintain
- **Resilient** - Robust against failures with graceful degradation

## When to Apply This Methodology

Apply the Fifteen-Factor principles during:

1. **Architecture Planning** - When designing new applications or microservices
2. **PRP/PRD Creation** - When documenting technical requirements and specifications
3. **Code Reviews** - When evaluating whether implementations follow best practices
4. **Migration Planning** - When modernising legacy applications for cloud deployment
5. **Technical Debt Assessment** - When identifying architectural improvements

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

## Applying Factors in Planning Sessions

When creating a PRP, PRD, or architecture plan, evaluate the design against each factor:

### Foundation Factors (I-VI)

These establish the baseline for any cloud-native application:

- **Codebase**: Define repository structure and branching strategy
- **Dependencies**: Specify package manager and dependency isolation approach
- **Config**: Plan environment variable strategy and secrets management
- **Backing Services**: Identify all external services and abstraction layers
- **Build/Release/Run**: Design CI/CD pipeline with immutable artifacts
- **Processes**: Ensure stateless design, plan session/state storage

### Operational Factors (VII-XII)

These ensure smooth operation and maintenance:

- **Port Binding**: Define service exposure strategy
- **Concurrency**: Plan horizontal scaling approach
- **Disposability**: Design for container orchestration
- **Dev/Prod Parity**: Minimise environment differences
- **Logs**: Plan logging infrastructure (ELK, Fluentd, etc.)
- **Admin Processes**: Automate one-off tasks

### Modern Extensions (XIII-XV)

These address contemporary requirements:

- **API First**: Define OpenAPI/Swagger contracts before implementation
- **Telemetry**: Plan APM, health endpoints, and observability
- **Security**: Design authentication/authorisation (OAuth2, RBAC)

## Architecture Checklist

Use this checklist when reviewing or planning an application:

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

To load detailed information about specific factors, read the appropriate reference file. For example, when planning API design, load `references/modern-extensions.md` for API First guidance.

### Searching References

For specific implementation patterns, search the references:

- API contracts: `grep -i "swagger\|openapi" references/`
- Logging patterns: `grep -i "log\|fluentd\|elk" references/`
- Security patterns: `grep -i "oauth\|rbac\|authentication" references/`
- Container patterns: `grep -i "docker\|container" references/`
