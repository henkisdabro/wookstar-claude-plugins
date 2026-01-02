# Original Twelve Factors (I-XII)

This reference contains detailed documentation for the original twelve factors from the Twelve-Factor App methodology.

---

## I. Codebase

**Principle:** One codebase is tracked in version control. There is only one codebase per application, but there will be many deploys of the application.

The codebase is the same across all deploys, although different versions may be active in each deployment. For example, a developer has some commits not yet deployed to staging; staging has some commits not yet deployed to production.

### Implementation

**Clone an existing Git Repository:**

```bash
git clone git@github.com:example/fifteen-factor-app.git
cd fifteen-factor-app
```

**Create a new Git Repository:**

```bash
git init
git add .
git commit -m "Initial commit for the application"
git remote add origin https://github.com/<username>/fifteen-factor-app.git
git push -u origin main
```

### Key Points

- One repository per application
- Multiple deploys from same codebase
- Version control is mandatory (Git recommended)
- Different versions may be active in different environments

---

## II. Dependencies

**Principle:** Never rely on the implicit existence of system-wide packages. Declare all dependencies completely and exactly via a dependency declaration manifest. Use dependency isolation during execution to ensure no implicit dependencies "leak in" from the surrounding system.

### Implementation Examples

**Maven (Java):**

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>foo-bar</artifactId>
  <version>1.2.3</version>
  <exclusions>
    <exclusion>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

**npm (Node.js):**

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  }
}
```

**pip (Python):**

```text
flask==2.3.0
requests==2.31.0
```

### Key Points

- Explicit declaration of all dependencies
- Dependency isolation (virtual environments, containers)
- Exclude transitive dependencies when necessary
- Lock file for reproducible builds

---

## III. Config

**Principle:** Everything that varies between different deploys across environments (staging, production, developer environments) is configuration. This includes:

- Database, distributed cache, and other backing services configuration
- Credentials to external services (Azure Event Hub, Amazon S3, Media Server)
- Application connectivity information (IP addresses, ports, hostnames)

Application configuration should never be hardcoded. Save configuration values in environment variables or externalise the configuration.

### Implementation Examples

**Spring Framework (Java):**

```properties
spring.datasource.url=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/movies
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}
```

**Node.js:**

```javascript
const config = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
```

### Key Points

- Never hardcode configuration
- Use environment variables
- Consider external config servers (Spring Cloud Config, Consul)
- Separate config from code

---

## IV. Backing Services

**Principle:** All backing services, whether local or third-party, should be treated as attached resources. The application code makes no distinction between local and third-party services. All are attached resources accessed via URL or other locator/credentials stored in config.

Attached resources can be swapped at any point without impacting the service.

### Examples of Backing Services

- Data stores: Oracle, MongoDB, MySQL, PostgreSQL
- Messaging/queueing systems: ActiveMQ, RabbitMQ, Kafka
- SMTP services: Postfix, SendGrid
- Caching systems: Redis, Memcached

### Implementation Example

**Spring JPA (Java):**

```java
@Repository
public interface JoggingRepository extends JpaRepository<Jogger, Long> {
}
```

The code is agnostic to the actual database provider - just defining the repository makes all standard operations available.

### Key Points

- Abstract backing services
- Resources are attached and detachable
- No code changes required to swap services
- Use configuration for connection details

---

## V. Build, Release, Run

**Principle:** Enforce strict separation between the build, release, and run stages. Code changes are not possible at runtime as there is no way to propagate those changes back to the build stage.

Automation using CI/CD tools (like Jenkins, GitHub Actions) facilitates the build and deployment process. Containerisation tools (like Docker) make it easy to separate stages efficiently.

### The Three Stages

**Build Stage:** Transform code repo into executable bundle (build)

```bash
mvn clean install
npm run build
```

**Release Stage:** Combine build with deploy's current config

```bash
docker build -t myapp:v1.2.3 .
```

**Run Stage:** Run the app in execution environment by launching processes

```bash
docker run --name <container_id> -it <image_id>
```

### Key Points

- Builds are immutable
- Releases combine builds with configuration
- Runtime changes are prohibited
- Every release has unique ID

---

## VI. Stateless Processes

**Principle:** Execute the app as one or more stateless processes. All processes are stateless and share nothing. Any data that needs to be persisted must be stored in a stateful backing service (such as a datastore).

By making applications aligned with stateless behaviour (REST), services can be horizontally scaled as per requirements without any impact.

### Key Points

- No local state in processes
- Session data in external store (Redis, database)
- Enables horizontal scaling
- No sticky sessions
- Process can be killed and restarted anytime

---

## VII. Port Binding

**Principle:** Export services via port binding. The application is completely self-contained and does not rely on runtime injection of a webserver into the execution environment to create a web-facing service.

From a Java perspective, Spring Boot is an example as it by default comes with an embedded server.

### Implementation Example

**Docker:**

```bash
docker run --restart always --name mysql8.0 \
  --net dev-network \
  -v /tools/ext-docker/mysqlext:/var/lib/mysql \
  -p 3306:3306 \
  -d -e MYSQL_ROOT_PASSWORD=some-pass mysql:8.0
```

### Key Points

- Self-contained applications
- Embedded web servers (Tomcat, Jetty, Undertow)
- No external webserver dependency
- Services accessible via port

---

## VIII. Concurrency

**Principle:** Scale out via the process model. Applications should be designed to distribute workload across multiple processes. Individual processes can leverage concurrency models like threads internally.

The share-nothing, horizontally partitionable nature of application processes means that adding more concurrency is a simple and reliable operation.

### Implementation Example

**Docker:**

```bash
docker run --name 15factor-app-1 -p 8081:8080 \
  --network dev-network -d vikasg11/15factor-app:0.0.1-SNAPSHOT

docker run --name 15factor-app-2 -p 8082:8080 \
  --network dev-network -d vikasg11/15factor-app:0.0.1-SNAPSHOT
```

### Key Points

- Horizontal scaling preferred
- Multiple process instances
- Load balancing across instances
- Internal threading for CPU-bound tasks

---

## IX. Disposability

**Principle:** Maximise robustness with fast startup and graceful shutdown. Processes are disposable - they can be started or stopped at a moment's notice. Graceful shutdowns are essential to ensure the correct state.

In containerisation and microservices, deployment processes implicitly follow this principle to a greater extent.

### Key Points

- Fast startup times (seconds, not minutes)
- Graceful shutdown on SIGTERM
- Complete in-flight requests
- Release resources properly
- Handle unexpected termination (SIGKILL)

---

## X. Dev/Prod Parity

**Principle:** Keep development, staging, and production as similar as possible. The application is designed for continuous deployment by keeping the gap between development and production small.

The principle also resists using different backing services between development and production, even when adapters theoretically abstract away differences.

### Key Points

- Minimise time gap (deploy quickly)
- Minimise personnel gap (developers deploy)
- Minimise tools gap (same backing services)
- Use containers for consistency
- Infrastructure as Code (Terraform, Pulumi)

---

## XI. Logs

**Principle:** Treat logs as event streams. Logs provide visibility into the behaviour of a running app. They are the stream of aggregated, time-ordered events collected from output streams of all running processes and backing services.

Separate log generation from log processing.

### Implementation

**Gradle (Java):**

```groovy
dependencies {
    implementation group: 'log4j', name: 'log4j', version: '1.2.17'
}
```

### Recommended Stack

- **Fluentd** - Collect stream of logs
- **Elasticsearch** - Storage and indexing
- **Kibana** - Visualisation and dashboards

### Key Points

- Write to stdout/stderr
- No local log files
- Centralised log aggregation
- Time-ordered event streams
- Separate generation from processing

---

## XII. Admin Processes

**Principle:** Run admin/management tasks as one-off processes. One-off admin processes should run in an identical environment as the regular long-running processes of the app.

Admin code must ship with application code to avoid synchronisation issues. Ensure one-off scripts are automated so they are not executed manually before releasing the build.

### Examples of Admin Processes

- Database migrations
- Console/REPL for debugging
- One-off scripts for data fixes
- Report generation

### Key Points

- Same environment as app
- Ship with application code
- Automate, don't run manually
- Use same dependency isolation
- Version controlled with app code
