````markdown
# 🎓 Campus Connect — Alumni Portal

An end-to-end DevOps implementation for a full-stack Alumni Portal built with **React.js, Spring Boot, and MySQL**.

The project demonstrates a production-style workflow covering **CI/CD automation, containerization, security scanning, AWS deployment, monitoring, centralized logging, persistent storage, and automated backups**.

---

## 📌 Project Overview

**Campus Connect** is a full-stack Alumni Portal designed to connect students and alumni through a web-based platform.

The main focus of this project was to implement the complete application delivery and operations lifecycle:

**Code → CI/CD → Security → Containerization → Deployment → Monitoring → Logging → Backup**

---

## 🏗️ Architecture

![Campus Connect Architecture](docs/campus-connect-architecture.png)

### High-Level Workflow

```text
Developer
   ↓
GitHub
   ↓
GitHub Webhook
   ↓
GitLab CI/CD
   ↓
Source Validation
   ↓
Testing
   ↓
Docker Build
   ↓
Trivy Security Scan
   ↓
Docker Hub
   ↓
AWS EC2
   ↓
Docker Compose
   ↓
Application
````

### Application Architecture

```text
Internet
    ↓
  Nginx
    ↓
React + Vite Frontend
    ↓
Spring Boot Backend
    ↓
   MySQL
    ↓
Persistent Docker Volume
```

---

# 🚀 Technology Stack

## Application

| Component                  | Technology      |
| -------------------------- | --------------- |
| Frontend                   | React.js + Vite |
| Web Server / Reverse Proxy | Nginx           |
| Backend                    | Spring Boot     |
| Backend Runtime            | Java 17         |
| Database                   | MySQL           |

## DevOps

| Area                    | Technology     |
| ----------------------- | -------------- |
| Source Control          | GitHub         |
| CI/CD                   | GitLab CI/CD   |
| Pipeline Trigger        | GitHub Webhook |
| Containerization        | Docker         |
| Container Orchestration | Docker Compose |
| Image Registry          | Docker Hub     |
| Security Scanning       | Trivy          |
| Cloud                   | AWS            |
| Compute                 | EC2 Ubuntu     |
| Deployment              | SSH            |

## Monitoring & Logging

| Area                  | Technology           |
| --------------------- | -------------------- |
| Metrics Collection    | Prometheus           |
| Host Metrics          | Node Exporter        |
| Container Metrics     | cAdvisor             |
| Dashboards & Alerting | Grafana              |
| Log Collector         | Grafana Alloy        |
| Log Storage           | Loki                 |
| Notifications         | Grafana Email Alerts |

## Backup

| Area                 | Technology    |
| -------------------- | ------------- |
| Database Persistence | Docker Volume |
| Backup Automation    | Cron          |
| Backup Storage       | Amazon S3     |
| AWS Access           | IAM Role      |

---

# 🔄 CI/CD Pipeline

The project uses **GitHub + GitLab CI/CD** for automated application delivery.

A GitHub webhook triggers the GitLab pipeline whenever changes are pushed.

### Pipeline Stages

```text
Source Validation
       ↓
Testing
       ↓
Docker Build
       ↓
Trivy Security Scan
       ↓
Docker Push
       ↓
Deployment
       ↓
Health Verification
```

### Pipeline Responsibilities

#### 1. Source Validation

Validates and prepares the application source code.

#### 2. Testing

Runs application tests before creating deployment images.

#### 3. Docker Build

Builds separate Docker images for:

* Frontend
* Backend

#### 4. Trivy Security Scan

Scans Docker images for known vulnerabilities before publishing them.

#### 5. Docker Push

Pushes the validated images to Docker Hub.

#### 6. Deployment

Connects to AWS EC2 through SSH and deploys the required application images using Docker Compose.

#### 7. Health Verification

Performs post-deployment checks to verify that the application services are running correctly.

---

# 🏷️ Image Versioning

Docker images are tagged using the Git commit SHA:

```text
$CI_COMMIT_SHORT_SHA
```

Example:

```text
hlanjewar/campus-connect-backend:abc1234
hlanjewar/campus-connect-frontend:abc1234
```

This provides:

* Deployment traceability
* Version identification
* Easier rollback
* Clear connection between source code and deployed images

---

# 🐳 Docker Implementation

The application is containerized using Docker Compose.

### Application Services

```text
┌──────────────────────────────┐
│        Docker Compose        │
├──────────────────────────────┤
│                              │
│  React + Nginx               │
│          ↓                   │
│  Spring Boot Backend         │
│          ↓                   │
│  MySQL Database              │
│                              │
└──────────────────────────────┘
```

The MySQL database uses persistent Docker storage so that recreating containers does not automatically remove application data.

> ⚠️ The MySQL volume is persistent and should not be removed with `docker compose down -v` during normal deployments.

---

# ☁️ AWS Deployment

The application is deployed on an **Ubuntu EC2 instance in AWS Mumbai (`ap-south-1`)**.

The EC2 instance hosts:

* Application containers
* Monitoring stack
* Logging stack
* Backup automation

### AWS Security

AWS Security Groups are used to control network access.

The general access model is:

```text
Internet
   ↓
HTTP : 80
   ↓
Nginx
   ↓
Application Services
```

SSH access is restricted rather than exposed broadly.

MySQL and internal application services are not intended to be publicly accessible.

---

# 📊 Monitoring & Alerting

The monitoring stack provides visibility into both the EC2 host and Docker containers.

### Monitoring Architecture

```text
EC2 Host
   ↓
Node Exporter
   ↓
Prometheus
   ↓
Grafana
```

```text
Docker Containers
       ↓
    cAdvisor
       ↓
   Prometheus
       ↓
     Grafana
```

### Components

**Node Exporter**

Collects Linux/EC2 host-level metrics such as CPU, memory, disk, and system statistics.

**cAdvisor**

Collects Docker container resource and health metrics.

**Prometheus**

Collects and stores monitoring metrics.

**Grafana**

Provides dashboards and alerting.

---

# 🚨 Grafana Alerting

Grafana email notifications were configured for infrastructure and container health.

Examples include:

* High CPU utilization
* Memory/resource conditions
* Container/service health issues

A high CPU alert was tested using an **85% CPU threshold** to verify that the alerting workflow works correctly.

---

# 📝 Centralized Logging

Docker container logs are collected and centralized using **Grafana Alloy and Loki**.

### Logging Architecture

```text
Docker Containers
       ↓
Grafana Alloy
       ↓
     Loki
       ↓
   Grafana
```

### Components

**Grafana Alloy**

Collects Docker container logs and forwards them to Loki.

**Loki**

Stores and indexes the log streams.

**Grafana**

Provides a central interface for exploring application and container logs.

This provides a separation between:

```text
Metrics → Prometheus
Logs    → Loki
Visualization & Alerts → Grafana
```

---

# 💾 Data Persistence & Backup

The MySQL database uses a persistent Docker volume.

```text
MySQL
  ↓
Persistent Docker Volume
  ↓
Application Data
```

This prevents normal container recreation from deleting the database data.

An automated backup process was also implemented using **cron**.

```text
MySQL / Backup Process
        ↓
   Automated Backup
        ↓
      Amazon S3
```

The EC2 instance uses an IAM role to access the required S3 resources.

Persistence and backup serve different purposes:

* **Docker Volume** → protects data during normal container recreation
* **Backup** → provides an additional recovery layer

---

# 🔐 Security

Security was incorporated into different parts of the workflow.

### CI/CD Security

* Trivy vulnerability scanning
* CI/CD variables for sensitive credentials
* Git commit-based image versioning

### AWS Security

* Security Groups for network access control
* Restricted SSH access
* Internal services kept private

### Container Security

* Isolated Docker networks
* MySQL not exposed publicly
* Persistent storage separated from container lifecycle

---

# 🛠️ Real-World Troubleshooting

During development and deployment, I worked through several practical issues, including:

### MySQL Permissions

Resolved database access problems caused by existing persistent MySQL state and user privileges.

### CORS

Troubleshot frontend/backend communication and configured the required cross-origin behavior.

### JWT Authentication

Investigated expired JWT authentication errors and distinguished application authentication failures from unrelated UI/Grafana rendering noise.

### Docker Port Conflicts

Identified port conflicts between services and verified listening ports before making changes.

### EC2 Public IP Changes

Handled changing EC2 public IP addresses after instance stop/start operations.

### Resource Pressure

Monitored CPU and memory usage on a small EC2 instance and investigated the impact of monitoring workloads during alert testing.

### Container Health

Used Docker and monitoring metrics to verify service health after deployment.

---

# 🔁 Deployment Flow

A typical deployment follows this workflow:

```text
1. Developer pushes code
             ↓
2. GitHub receives commit
             ↓
3. GitHub Webhook triggers GitLab
             ↓
4. GitLab CI/CD starts
             ↓
5. Source validation
             ↓
6. Tests execute
             ↓
7. Docker images are built
             ↓
8. Trivy scans images
             ↓
9. Images are pushed to Docker Hub
             ↓
10. EC2 deployment starts
             ↓
11. Docker Compose updates services
             ↓
12. Health checks verify deployment
```

---

# 🎯 Key Project Highlights

* End-to-end GitHub → GitLab CI/CD workflow
* Webhook-triggered pipeline
* Automated testing
* Docker containerization
* Docker Compose deployment
* Trivy vulnerability scanning
* Docker Hub image registry
* Git commit SHA image tagging
* AWS EC2 deployment
* Nginx reverse proxy
* Persistent MySQL storage
* Prometheus monitoring
* Grafana dashboards and alerts
* Node Exporter host monitoring
* cAdvisor container monitoring
* Loki centralized logging
* Grafana Alloy log collection
* Automated backup using cron
* S3 backup storage
* AWS IAM role-based access
* Post-deployment health verification

---

# 📚 What I Learned

This project provided hands-on experience with the complete DevOps lifecycle:

```text
Source Control
      ↓
CI/CD Automation
      ↓
Security Scanning
      ↓
Containerization
      ↓
Cloud Deployment
      ↓
Monitoring
      ↓
Centralized Logging
      ↓
Backup & Recovery
      ↓
Troubleshooting
```

The project also helped me understand how different DevOps tools work together rather than learning each tool in isolation.

---

# 🔮 Future Enhancements

The current implementation intentionally uses a lightweight architecture.

Potential future enhancements include:

* HTTPS with a custom domain
* Infrastructure as Code with Terraform
* Kubernetes deployment
* Helm
* GitOps with Argo CD
* AWS CloudWatch integration
* Load balancing and auto scaling

These are kept as separate future improvements rather than unnecessary additions to the current architecture.

---

# 👨‍💻 Author

**Hitesh Lanjewar**

Aspiring DevOps Engineer

* GitHub: `HiteshL30`
* LinkedIn: `hitesh-lanjewar-devopsengineer`

---

# ⭐ Project

If you find this project useful or are learning DevOps, feel free to explore the repository and the implementation.

````



