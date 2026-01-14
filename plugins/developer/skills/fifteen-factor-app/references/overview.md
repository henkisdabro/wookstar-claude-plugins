# Fifteen-Factor App Methodology - Overview

## Introduction

The Fifteen-Factor App methodology is an extension of the original Twelve-Factor App principles created by Heroku programmers in 2012. The original methodology provided general principles and guidelines for creating robust enterprise applications. With the evolution of modern application architectures - particularly containerised cloud-native applications and microservices - three additional factors have been identified as essential.

## The Extended Methodology

The Fifteen-Factor App methodology adds three factors to address modern architectural requirements:

1. **API First Approach** - Design service contracts before implementation
2. **Telemetry** - Monitor distributed application deployments
3. **Security** - Implement authentication and authorisation for each request

## Core Principles

The methodology remains aligned with the original Twelve-Factor principles:

- Use **Declarative Formats** for setup automation, minimising time and cost for new developers
- Have a **Clean Contract**, offering maximum portability between execution environments
- Are suitable for deployment on **modern Cloud Platforms**, obviating the need for dedicated servers
- **Minimise Divergence** between development and production, enabling continuous deployment
- **Dynamically Scalable** without significant changes to tooling, architecture, or development practices
- **Service-Driven Approach** - Contracts available for frontend clients, routing gateways, or downstream systems
- **Monitoring** distributed deployments for domain/application-specific data, health, and statistics
- **Security** addressed appropriately with identity implementation for each request

## Factor Summary Table

| # | Factor | Principle | Implementation Focus |
|---|--------|-----------|---------------------|
| I | Codebase | One codebase tracked in version control | Git repository, branching strategy |
| II | Dependencies | Explicitly declare and isolate | Package managers (Maven, npm, pip) |
| III | Config | Store config in environment | Environment variables, external config |
| IV | Backing Services | Treat as attached resources | Database abstraction, service locators |
| V | Build, Release, Run | Strict separation of stages | CI/CD pipelines, immutable artifacts |
| VI | Processes | Stateless and share-nothing | Horizontal scaling, external state |
| VII | Port Binding | Export services via port | Self-contained services, embedded servers |
| VIII | Concurrency | Scale out via process model | Container orchestration, load balancing |
| IX | Disposability | Fast startup, graceful shutdown | Health checks, signal handling |
| X | Dev/Prod Parity | Keep environments similar | Docker, infrastructure as code |
| XI | Logs | Treat as event streams | Log aggregation, centralised logging |
| XII | Admin Processes | Run as one-off processes | Automated scripts, same environment |
| XIII | API First | Design contracts first | OpenAPI/Swagger, contract testing |
| XIV | Telemetry | Monitor everything | APM, metrics, distributed tracing |
| XV | Security | Authentication & Authorisation | OAuth2, RBAC, identity management |

## Factor Categories

### Foundation Factors (I-VI)

These establish the fundamental architecture:

- **Codebase** - Version control and deployment model
- **Dependencies** - Package management and isolation
- **Config** - Externalised configuration
- **Backing Services** - Service abstraction
- **Build/Release/Run** - Deployment pipeline
- **Processes** - Stateless architecture

### Operational Factors (VII-XII)

These ensure operational excellence:

- **Port Binding** - Service exposure
- **Concurrency** - Scaling model
- **Disposability** - Resilience
- **Dev/Prod Parity** - Environment consistency
- **Logs** - Observability
- **Admin Processes** - Maintenance

### Modern Extensions (XIII-XV)

These address contemporary requirements:

- **API First** - Contract-driven development
- **Telemetry** - Full observability stack
- **Security** - Zero-trust architecture

## Architecture Decision Framework

When designing a new application or evaluating an existing one, use this decision framework:

### Phase 1: Foundation

1. How will the codebase be structured and versioned?
2. How will dependencies be declared and isolated?
3. Where will configuration be stored?
4. How will backing services be abstracted?
5. What is the build/release/run pipeline?
6. How will state be managed externally?

### Phase 2: Operations

7. How will services expose their ports?
8. What is the horizontal scaling strategy?
9. How will services handle startup/shutdown?
10. How will environments be kept consistent?
11. How will logs be collected and processed?
12. How will admin tasks be automated?

### Phase 3: Modern Requirements

13. Are API contracts defined before implementation?
14. Is comprehensive telemetry in place?
15. Is security properly implemented throughout?

## Related References

- `original-factors.md` - Detailed documentation for factors I-XII
- `modern-extensions.md` - Detailed documentation for factors XIII-XV
- `setup-and-tools.md` - Tooling and implementation guidance
