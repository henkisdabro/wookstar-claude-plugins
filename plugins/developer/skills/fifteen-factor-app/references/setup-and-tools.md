# Setup and Tools Reference

This reference provides quick setup guidance and tooling recommendations for implementing the Fifteen-Factor App methodology.

---

## Git Quick Start

Configure your Git user before starting:

```bash
git config --global user.name "Your Fullname"
git config --global user.email "Your Email"
```

For Windows users, Git Bash is recommended for a better command-line experience.

### Connecting to GitHub Using SSH

Refer to [GitHub SSH documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) to set up SSH for your GitHub account.

### Clone an Application

```bash
git clone git@github.com:example/fifteen-factor-app.git
cd fifteen-factor-app
```

---

## Java/Spring Framework Stack

### Recommended Tools

Use the current release of each unless the project pins one.

| Tool | Version | Required |
|------|---------|----------|
| JDK | Current LTS | Yes |
| Java IDE | IntelliJ IDEA / VS Code | Yes |
| Gradle | Current | Yes |
| Maven | Current | Alternative |
| Git client | Current | Yes |
| Docker | Current | Yes |
| Spring Boot | Current supported line | Yes |

### Spring Boot Starter Dependencies

```groovy
dependencies {
    // Web
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // Data
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'

    // Security
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'

    // Observability
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.micrometer:micrometer-registry-prometheus'

    // Tracing
    implementation 'io.micrometer:micrometer-tracing-bridge-otel'
    implementation 'io.opentelemetry:opentelemetry-exporter-otlp'
}
```

---

## Node.js/TypeScript Stack

### Recommended Tools

| Tool | Version | Required |
|------|---------|----------|
| Node.js | Active LTS | Yes |
| pnpm | Current | Yes |
| TypeScript | Current | Yes |
| Docker | Current | Yes |

### Essential Packages

```bash
pnpm add express dotenv winston prom-client
pnpm add -D typescript @types/node @types/express
```

---

## Python Stack

### Recommended Tools

| Tool | Version | Required |
|------|---------|----------|
| Python | Current stable | Yes |
| uv | Current | Yes |
| Docker | Current | Yes |

### Essential Packages

```bash
uv add fastapi uvicorn python-dotenv structlog prometheus-client
```

---

## Container and Orchestration

### Docker Basics

**Dockerfile Example:**

```dockerfile
FROM node:lts-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Pin the base image by digest for production; the developer plugin's `/containerize` skill covers cache mounts, distroless images and healthchecks.

**Docker Compose** (`compose.yaml`; the top-level `version:` key is obsolete):

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - db
      - redis

  db:
    image: postgres:18-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql  # 18+ mounts here, not .../data

  redis:
    image: redis:8-alpine

volumes:
  postgres_data:
```

### Kubernetes Basics

**Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fifteen-factor-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fifteen-factor-app
  template:
    metadata:
      labels:
        app: fifteen-factor-app
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## CI/CD Pipelines

### GitHub Actions Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: pnpm/action-setup@v6

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: lts/*
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Build and push Docker image
        if: github.ref == 'refs/heads/main'
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker push myapp:${{ github.sha }}
```

---

## Observability Stack

### ELK Stack (Logs)

- **Elasticsearch** - Log storage and indexing
- **Logstash/Fluentd** - Log collection and processing
- **Kibana** - Visualisation and dashboards

### Prometheus + Grafana (Metrics)

**Prometheus scrape config:**

```yaml
scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

### Jaeger/Zipkin (Tracing)

**OpenTelemetry setup:**

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4318/v1/traces',
  }),
});

sdk.start();
```

---

## Security Tools

### Secret Management

- **HashiCorp Vault** - Enterprise secret management
- **AWS Secrets Manager** - AWS-native secrets
- **1Password CLI** - Developer-friendly option
- **doppler** - Environment variable sync

### API Security

- **Auth0** - Identity as a Service
- **Keycloak** - Self-hosted identity provider
- **OAuth2 Proxy** - Add auth to any service

---

## Development Environment

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-azuretools.vscode-docker",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "redhat.vscode-yaml",
    "42crunch.vscode-openapi"
  ]
}
```

### Environment Variables Template

Create a `.env.example` file:

```bash
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/app

# Cache
REDIS_URL=redis://localhost:6379

# External Services
API_KEY=your-api-key-here
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```
