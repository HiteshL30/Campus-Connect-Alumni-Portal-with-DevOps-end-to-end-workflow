# Campus Connect deployment on Utho with Docker and GitLab CI

## What was detected from your project

- Frontend: React + Vite
- Backend: Spring Boot 3 with Java 17
- Database: MySQL 8
- Database migrations: Flyway inside the backend

## Files added for deployment

- `frontend/Dockerfile`
- `frontend/nginx/default.conf`
- `backend/Dockerfile`
- `database/Dockerfile`
- `database/init/01-init.sql`
- `docker-compose.prod.yml`
- `.env.example`
- `.gitlab-ci.yml`

## 1. Prepare the Utho server

Install Docker and Docker Compose plugin on the server:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Create the app folder:

```bash
mkdir -p /opt/campus-connect
```

## 2. Copy project to the server

Upload the `Campus Connect` folder to the server, for example to:

```bash
/opt/campus-connect
```

## 3. Create production env file

On the server:

```bash
cd /opt/campus-connect
cp .env.example .env
```

Edit `.env` and set real secrets:

```env
MYSQL_ROOT_PASSWORD=strong-root-password
MYSQL_DATABASE=alumni_connect
MYSQL_USER=alumni_user
MYSQL_PASSWORD=strong-app-password
JWT_SECRET=very-long-random-secret
GEMINI_API_KEY=your-key-if-you-use-gemini
LLM_PROVIDER=llama
LLM_LLAMA_URL=http://host.docker.internal:11434/api/generate
```

## 4. Start the app manually on Utho

```bash
cd /opt/campus-connect
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Check status:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

## 5. Open ports in Utho firewall

Allow:

- `80` for the frontend
- `22` for SSH

If you want HTTPS later, also allow:

- `443`

## 6. GitLab CI/CD variables you must create

In GitLab project settings, add these CI/CD variables:

- `UTHO_HOST` = your server public IP or domain
- `UTHO_USER` = ssh username
- `UTHO_APP_PATH` = `/opt/campus-connect`
- `UTHO_SSH_PRIVATE_KEY` = private SSH key content

## 7. How the deployment works

- Frontend runs in Nginx on port `80`
- Nginx proxies `/api` and `/ws` to the backend container
- Backend runs Spring Boot on port `8080`
- Backend connects to MySQL container named `database`
- Flyway creates and updates tables automatically

## 8. Important note

Your current backend config contains hardcoded local secrets and localhost DB settings in Spring property files. For production, Docker environment variables should be the source of truth.
