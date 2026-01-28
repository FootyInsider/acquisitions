# Acquisitions API - Docker Quick Start

A secure Node.js/Express API with Drizzle ORM and Neon Database, containerized for easy development and production deployment.

## 🚀 Quick Start

### Development (with Neon Local)
```bash
# 1. Configure your Neon credentials in .env.development
# 2. Start development environment
npm run docker:dev

# Your app will be available at:
# - API: http://localhost:3000
# - Health Check: http://localhost:3000/health
# - Database: postgres://neon:npg@localhost:5432/neondb
```

### Production (with Neon Cloud)
```bash
# 1. Set production environment variables
export DATABASE_URL="your_neon_production_url"
export ARCJET_KEY="your_arcjet_key" 
export JWT_SECRET="your_secure_jwt_secret"

# 2. Start production environment
npm run docker:prod
```

## 🏗️ What's Included

### Development Stack
- **Neon Local**: Ephemeral database branches for isolated development
- **Hot Reload**: Automatic restarts on code changes
- **Debug Logging**: Enhanced logging for troubleshooting
- **Drizzle Studio**: Database management UI (optional)

### Production Stack  
- **Neon Cloud**: Direct connection to production database
- **Security Hardened**: Non-root user, minimal attack surface
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Automatic monitoring and recovery
- **Nginx Ready**: Optional reverse proxy configuration

## 🔧 Architecture

**Development Flow:**
```
Your App (Docker) ↔ Neon Local Proxy (Docker) ↔ Neon Cloud Database
```

**Production Flow:**
```
Your App (Docker) ↔ Neon Cloud Database (Direct SSL Connection)
```

## 📚 Documentation

- **[Complete Docker Guide](./DOCKER-DEPLOYMENT.md)** - Comprehensive setup and deployment instructions
- **[API Documentation](./AGENTS.md)** - API architecture and development guide

## 🛠️ Available Commands

```bash
# Development
npm run docker:dev          # Start dev environment
npm run docker:dev:down     # Stop and cleanup dev environment

# Production  
npm run docker:prod         # Start prod environment
npm run docker:prod:down    # Stop prod environment

# Database
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate   # Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate  # Generate migrations
```

## ⚙️ Environment Configuration

The application automatically switches between Neon Local (development) and Neon Cloud (production) based on the `DATABASE_URL` format:

- **Neon Local**: `postgres://neon:npg@neon-local:5432/dbname`  
- **Neon Cloud**: `postgres://username:password@ep-xxx.neon.tech/dbname`

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Rate limiting with Arcjet (5 req/min guests, 10 req/min users, 20 req/min admins)
- Bot detection and shield protection
- Input validation with Zod schemas
- Secure headers with Helmet
- Non-root container execution

## 📈 Next Steps

1. **[Read the full Docker deployment guide](./DOCKER-DEPLOYMENT.md)**
2. **Configure your Neon credentials**  
3. **Run `npm run docker:dev` to start developing**
4. **Deploy to production with `npm run docker:prod`**

---

For detailed configuration options, troubleshooting, and production deployment strategies, see the **[Complete Docker Deployment Guide](./DOCKER-DEPLOYMENT.md)**.