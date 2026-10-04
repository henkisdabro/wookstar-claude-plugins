# Modern Extensions (XIII-XV)

This reference contains detailed documentation for the three additional factors that extend the original Twelve-Factor App methodology for modern cloud-native applications.

---

## XIII. API First

**Principle:** Define the service contract first to help consumers understand what the request and response communication is expected to be. Service consumers can work in parallel to develop consuming applications, even before the actual service contract is implemented and available.

### Key Advantages

1. **Cross-Platform Compatible** - Facilitates discussions with stakeholders whether internal team, customers, or third-party systems integrating with the APIs
2. **Parallel Development** - Teams can develop in parallel knowing what to expect
3. **Reuse of Schemas** - Enables reuse of contract definitions across services

### Benefits

- Avoids bottlenecks from waterfall model
- Multiple stakeholders can work in parallel
- Cuts implementation and integration time
- Enables API virtualisation for early testing
- Extension of contract-first development pattern

### Tools

- **Apiary** - GitHub integration and server mocks
- **Prism** - Open-source HTTP mock server
- **Swagger/OpenAPI** - API documentation and contract generation
- **Postman** - API testing and mock servers

### Implementation Examples

**Gradle Dependencies (Java):**

```groovy
dependencies {
    // springdoc-openapi (Springfox is unmaintained); 3.x targets Spring Boot 4, 2.8.x Spring Boot 3
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:3.1.1'
}
```

**OpenAPI Annotations:**

```java
@PutMapping("/{contextName}/user/{userName}")
@Operation(summary = "Update a user's configuration")
@ApiResponses({
    @ApiResponse(responseCode = "200",
        description = "Successfully updated the user configuration",
        content = @Content(schema = @Schema(implementation = UserProperty.class))),
    @ApiResponse(responseCode = "404", description = "Context or user not found"),
    @ApiResponse(responseCode = "500", description = "Server error")
})
UserProperty updateUser(
    @Parameter(description = "Context name", required = true)
    @PathVariable String contextName,

    @Parameter(description = "User name", required = true)
    @PathVariable String userName,

    @RequestBody UpdateUserRequest updateUserRequest);
```

**OpenAPI 3.0 Specification:**

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
```

### Implementation Checklist

- [ ] API contracts defined before implementation
- [ ] OpenAPI/Swagger documentation generated
- [ ] Mock servers available for parallel development
- [ ] Contract tests in place
- [ ] API versioning strategy defined
- [ ] Breaking change policy documented

---

## XIV. Telemetry

**Principle:** Design to include collection of monitoring domain/application-specific logs/data, health information, and statistics on modern cloud platforms. With increasing dynamicity in deployments, especially in cloud-native environments, this factor is essential.

### Telemetry Categories

1. **Application Performance Monitoring (APM)**
   - Stream of events monitoring application performance
   - Response times, throughput, error rates
   - Database query performance
   - External service call metrics

2. **Domain-Specific Telemetry**
   - Stream of events and data for analytics and reporting
   - Business metrics and KPIs
   - User behaviour analytics
   - Custom application metrics

3. **Health and System Logs**
   - Application start, shutdown, scaling events
   - Web request tracing
   - Periodic health check results
   - Resource utilisation metrics

### Recommended Tools

| Category | Tools |
|----------|-------|
| Health & System Logs | Cloud Provider Tools, ELK Stack |
| Distributed Tracing | Jaeger, Zipkin, OpenTelemetry |
| Metrics & Dashboards | Grafana, Prometheus |
| APM | AppDynamics, New Relic, Datadog |
| Container Orchestration | Kubernetes metrics, Istio |

### Implementation Examples

**Gradle Dependencies (Java):**

```groovy
dependencies {
    // Distributed tracing - OpenTelemetry (OpenTracing is archived); export OTLP to Jaeger or Zipkin
    implementation 'io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter:2.32.0'

    // Logging - SLF4J with Logback (log4j 1.x is end-of-life); pulls in slf4j-api
    implementation 'ch.qos.logback:logback-classic:1.6.5'

    // Health probe - Spring Boot Actuator
    implementation "org.springframework.boot:spring-boot-starter-actuator:${spring_boot_version}"
}
```

**Spring Boot Actuator Endpoints:**

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

**Prometheus Metrics (Node.js):**

```javascript
const prometheus = require('prom-client');

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status']
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### Implementation Checklist

- [ ] APM solution integrated
- [ ] Health check endpoints exposed
- [ ] Distributed tracing configured
- [ ] Metrics collection enabled
- [ ] Dashboards created for key metrics
- [ ] Alerting rules defined
- [ ] Log aggregation configured

---

## XV. Security (Authentication and Authorisation)

**Principle:** Security is essential for any application. All applications, especially cloud-native applications, should secure their APIs using Role-Based Access Control (RBAC). Implement identity for each request to maintain audit trails and track data changes.

### Why Security Matters

- Maintain audit trail of events per user session
- Track which user made which data changes
- Protect sensitive data and operations
- Comply with regulations (GDPR, HIPAA, SOC2)
- Prevent unauthorised access

### Security Standards and Solutions

| Category | Solutions |
|----------|-----------|
| Authentication | OAuth2, OpenID Connect, SAML |
| Single Sign-On | Okta, Auth0, Keycloak |
| Authorisation | RBAC, ABAC, Policy engines (OPA) |
| API Security | JWT tokens, API keys, mTLS |
| Secret Management | HashiCorp Vault, AWS Secrets Manager |

### Implementation Patterns

**JWT Token Validation (Spring Security):**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .oauth2ResourceServer()
                .jwt();
    }
}
```

**RBAC Implementation (Node.js):**

```javascript
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

app.delete('/users/:id',
  authenticate,
  checkRole('admin'),
  deleteUserHandler
);
```

**OAuth2 Configuration:**

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.example.com/
          jwk-set-uri: https://auth.example.com/.well-known/jwks.json
```

### Security Checklist

- [ ] Authentication mechanism implemented (OAuth2/OIDC)
- [ ] Authorisation model defined (RBAC/ABAC)
- [ ] All API endpoints protected
- [ ] JWT token validation configured
- [ ] Secret management solution in place
- [ ] Audit logging enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured (CORS, CSP, etc.)

### Zero Trust Principles

1. **Never trust, always verify** - Authenticate every request
2. **Least privilege access** - Minimum permissions required
3. **Assume breach** - Design as if network is compromised
4. **Verify explicitly** - Use multiple factors when possible
5. **Limit blast radius** - Segment access and permissions
