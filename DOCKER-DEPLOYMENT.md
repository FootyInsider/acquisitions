# Docker Deployment Guide

This guide explains how to run the Acquisitions API using Docker with different configurations for development and production environments.

## 🏗️ Architecture Overview

- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Connects directly to Neon Cloud database
- **Database ORM**: Drizzle with automatic connection configuration

## 📋 Prerequisites

### For Development
- Docker and Docker Compose installed
- Neon account with API key
- Git repository cloned locally

### For Production
- Docker and Docker Compose installed
- Production Neon database URL
- Environment variables or secrets management system
- Optional: Reverse proxy (Nginx) configuration

## 🔧 Environment Setup

### 1. Configure Neon API Credentials

Copy your Neon credentials from the [Neon Console](https://console.neon.tech):

```bash
# Get your Neon API key from: https://console.neon.tech/app/settings/api-keys
# Get your project ID from: Project Settings → General
```

### 2. Update Environment Files

**For Development (.env.development):**
```bash
# Update these values with your actual Neon credentials
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_project_id
PARENT_BRANCH_ID=your_parent_branch_id  # Usually 'main' or default branch
ARCJET_KEY=your_arcjet_key
```

**For Production (.env.production):**
```bash
# These should be injected via your deployment platform
DATABASE_URL=postgresql://username:password@ep-xxx-pooler.neon.tech/dbname?sslmode=require
ARCJET_KEY=your_production_arcjet_key
JWT_SECRET=your_secure_jwt_secret
```

## 🚀 Development Deployment

### Option 1: Quick Start (Recommended)
```bash
# Start development environment with Neon Local
npm run docker:dev

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop and cleanup
npm run docker:dev:down
```

### Option 2: Manual Docker Compose
```bash
# Build and start services
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (fresh start)
docker-compose -f docker-compose.dev.yml down -v
```

### Option 3: With Drizzle Studio
```bash
# Start with database management UI
docker-compose -f docker-compose.dev.yml --profile studio up --build

# Drizzle Studio will be available at: http://localhost:4983
```

### Development Features
- **Hot Reload**: Source code changes trigger automatic restarts
- **Ephemeral Branches**: Fresh database branch created on each startup
- **Debug Logging**: Enhanced logging for development
- **Database Studio**: Optional Drizzle Studio for database management
- **Git Integration**: Neon Local can create persistent branches per Git branch

## 🌐 Production Deployment

### Option 1: Quick Production Start
```bash
# Set environment variables
export DATABASE_URL="your_production_neon_url"
export ARCJET_KEY="your_production_arcjet_key"
export JWT_SECRET="your_secure_jwt_secret"

# Start production environment
npm run docker:prod

# Stop production environment
npm run docker:prod:down
```

### Option 2: Manual Production Deployment
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Option 3: With Nginx Reverse Proxy
```bash
# Start with Nginx proxy (requires nginx/nginx.conf)
docker-compose -f docker-compose.prod.yml --profile proxy up -d --build
```

### Production Features
- **Resource Limits**: CPU and memory constraints for stability
- **Health Checks**: Automatic container health monitoring  
- **Restart Policies**: Automatic restart on failure
- **Security**: Non-root user, minimal attack surface
- **Logging**: Structured JSON logging for monitoring
- **Direct Neon Cloud**: No proxy, direct database connection

## 🔍 Service Details

### Development Services
- **neon-local**: Neon Local proxy (port 5432)
- **app**: Main application (port 3000)
- **drizzle-studio**: Database management UI (port 4983, optional)

### Production Services
- **app**: Main application (port 3000)
- **nginx**: Reverse proxy (ports 80/443, optional)

## 📊 Monitoring and Debugging

### Check Service Status
```bash
# Development
docker-compose -f docker-compose.dev.yml ps

# Production  
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local
```

### Access Application Health Check
```bash
# Health endpoint
curl http://localhost:3000/health

# API status
curl http://localhost:3000/api
```

### Connect to Database (Development)
```bash
# Direct connection to Neon Local
psql "postgres://neon:npg@localhost:5432/neondb?sslmode=require"
```

## 🛠️ Database Management

### Run Migrations
```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Generate New Migrations
```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Production (not recommended in prod)
docker-compose -f docker-compose.prod.yml exec app npm run db:generate
```

### Access Drizzle Studio
```bash
# Start with studio profile
docker-compose -f docker-compose.dev.yml --profile studio up -d

# Visit: http://localhost:4983
```

## 🚨 Troubleshooting

### Common Issues

**1. Neon Local Connection Failed**
```bash
# Check Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables
docker-compose -f docker-compose.dev.yml exec neon-local env | grep NEON
```

**2. App Won't Start**
```bash
# Check app logs
docker-compose -f docker-compose.dev.yml logs app

# Restart specific service
docker-compose -f docker-compose.dev.yml restart app
```

**3. Database Connection Issues**
```bash
# Test database connectivity
docker-compose -f docker-compose.dev.yml exec app node -e "
  import('./src/config/database.js')
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection failed:', err))
"
```

**4. Port Conflicts**
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# Kill conflicting processes
sudo kill -9 $(lsof -ti:3000)
```

### Clean Restart
```bash
# Development - complete cleanup
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
docker system prune -f
npm run docker:dev

# Production - complete cleanup  
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f
npm run docker:prod
```

## 🔒 Security Considerations

### Development
- Default JWT secret (change for any shared environments)
- Debug logging enabled
- Ephemeral database branches (automatically cleaned up)

### Production
- Strong JWT secrets via environment variables
- Resource limits and health checks
- Non-root container user
- Minimal container surface area
- Direct encrypted connection to Neon Cloud

## 📈 Scaling and Performance

### Development
- Single replica for simplicity
- No resource constraints
- Full debugging and hot reload

### Production
- Configure resource limits based on load
- Health checks for automatic recovery
- Consider horizontal scaling with load balancers
- Monitor database connection pooling

## 🎯 Next Steps

1. **Development**: Start with `npm run docker:dev` and verify all endpoints work
2. **Database**: Run migrations and test with sample data
3. **Production**: Configure production environment variables
4. **Monitoring**: Set up logging aggregation and metrics
5. **CI/CD**: Integrate Docker builds into your deployment pipeline

For additional help, check the [Neon Documentation](https://neon.tech/docs) and [Docker Compose Documentation](https://docs.docker.com/compose/).