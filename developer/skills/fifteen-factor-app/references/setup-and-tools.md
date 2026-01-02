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

Refer to [GitHub SSH documentation](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) to set up SSH for your GitHub account.

### Clone an Application

```bash
git clone git@github.com:example/fifteen-factor-app.git
cd fifteen-factor-app
```

---

## Java/Spring Framework Stack

### Recommended Tools

| Tool | Version | Required |
|------|---------|----------|
| JDK | 17+ (LTS) | Yes |
| Java IDE | IntelliJ IDEA / VS Code | Yes |
| Gradle | 8.x | Yes |
| Maven | 3.9.x | Alternative |
| Git client | 2.x | Yes |
| Docker | 24.x | Yes |
| Spring Boot | 3.2.x | Yes |

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
| Node.js | 20+ (LTS) | Yes |
| pnpm | 8.x | Yes |
| TypeScript | 5.x | Yes |
| Docker | 24.x | Yes |

### Essential Packages

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0",
    "winston": "^3.11.0",
    "prom-client": "^15.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0"
  }
}
```

---

## Python Stack

### Recommended Tools

| Tool | Version | Required |
|------|---------|----------|
| Python | 3.11+ | Yes |
| pip | Latest | Yes |
| Poetry | 1.7+ | Recommended |
| Docker | 24.x | Yes |

### Essential Packages

```text
fastapi>=0.109.0
uvicorn>=0.27.0
python-dotenv>=1.0.0
structlog>=24.1.0
prometheus-client>=0.19.0
```

---

## Container and Orchestration

### Docker Basics

**Dockerfile Example:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Docker Compose:**

```yaml
version: '3.8'
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
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

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

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

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
