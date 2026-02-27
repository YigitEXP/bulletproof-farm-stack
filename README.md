# 🛡️ Fortified FARM Stack: A DevSecOps Case Study

Hi! I'm **Yiğit Can Aktürk**, a 2nd-year Computer Engineering student at Süleyman Demirel University. This project is my personal laboratory for exploring **System Architecture**, **Full Stack Development**, and **DevSecOps**.

Instead of a standard CRUD application, I built a secure, production-ready infrastructure using the **FARM Stack** (FastAPI, React, MongoDB).

## 🏗️ Architectural Blueprint

I followed **Clean Architecture** principles to ensure strict separation between layers. The entire system is containerized and orchestrated via Docker.

[Image of a microservices architecture diagram showing Nginx as a reverse proxy, FastAPI backend, Redis for caching, and MongoDB for storage]

### 🔐 Security & DevSecOps Features
- **Brute Force Defense:** Integrated a **Redis** rate-limiter on auth endpoints. If a bot spams the API, Redis blocks them with a `429 Too Many Requests` error.
- **Reverse Proxy Shield:** An **Nginx** server acts as the primary gateway. The backend and database are isolated within a private Docker `app-network`.
- **Vulnerability Management:** I use **Trivy** for automated container scanning and **OWASP ZAP** for dynamic application security testing (DAST).
- **Performance Auditing:** Integrated **Grafana k6** to simulate load tests and ensure system stability under stress.
- **Type Safety:** Leveraged **Pydantic** models to enforce strict data validation and prevent malformed JSON payloads.

## 🚦 Smart Automation (`operate.sh`)

I developed a custom Bash operational script to manage the entire lifecycle:

```bash
bash operate.sh start       # Spin up the environment
bash operate.sh trivy-scan  # Scan images for vulnerabilities
bash operate.sh k6-test     # Run automated load tests
bash operate.sh backup      # Secure MongoDB backups
bash operate.sh hard-start  # Clean build and redeploy
