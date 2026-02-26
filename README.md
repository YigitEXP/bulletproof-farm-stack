# 🛡️ Fortified FARM Stack (My DevSecOps Journey)

Hi! Im a 2nd-year Computer Engineering student who is deeply interested in System Architecture and DevSecOps. This is my hands-on passion project. Instead of just building a standard "hello world" CRUD app, I wanted to build a secure, "Bulletproof" infrastructure using the FARM stack (FastAPI, React, MongoDB).

Im still learning and exploring, but I tried my best to apply real enterprise security practices to solve common bottlenecks and OWASP vulnerabilities. 

## 🏗️ What I Built

I separated the frontend, backend and proxy layers using Clean Architecture principles. Everything is containerized and orchestrated with Docker Compose so it works perfectly on any machine.

### 🔐 Security & DevSecOps Features
- **Defeating Brute Force:** I added a **Redis** rate limiter to the FastAPI login and register endpoints. If a bot tries to spam the API, Redis blocks them with a 429 Too Many Requests error before they even touch MongoDB.
- **Container Security:** I used multi-stage Docker builds with lightweight `alpine` images to reduce the attack surface. I also scan my containers with **Trivy** to catch CVEs.
- **Offensive Testing:** I dont just write code, I attack it! I use **Grafana k6** to simulate DDoS/Load testing on my endpoints, and **OWASP ZAP** to scan for XSS, SQL injection and other vulnerabilities.
- **Safe Routing:** I put an **Nginx** reverse proxy in front of the application. The backend is hidden inside a private Docker network (`app-network`).
- **Data Validation:** Pydantic models on the backend ensure that bad JSON payloads are rejected immediately.

## 🚀 Tech Stack Used

* **Frontend:** React (Vite), Axios
* **Backend:** FastAPI (Python), Pydantic, Redis
* **Database:** MongoDB
* **Infra:** Docker, Docker Compose, Nginx
* **Testing & Auditing:** Trivy, OWASP ZAP, k6

## 🚦 How to Run

If you want to test this infrastructure on your machine:

1. Clone the repo and go to the project folder
2. Run the magic operational script:
   ```bash
   bash operate.sh start