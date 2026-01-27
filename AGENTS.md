# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start development server with file watching on port 3000
- The app uses ES modules (`"type": "module"` in package.json)

### Code Quality
- `npm run lint` - Run ESLint with strict rules (2-space indent, single quotes, semicolons)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check Prettier formatting

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Architecture Overview

This is a Node.js/Express API using a layered architecture with path aliases for clean imports:

### Core Structure
- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: Drizzle ORM with Neon PostgreSQL serverless
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Logging**: Winston with file and console transports
- **Validation**: Zod schemas with custom error formatting

### Path Aliases (Import Maps)
The project uses Node.js import maps for clean imports:
```javascript
'#config/*': './src/config/*'
'#controllers/*': './src/controllers/*'
'#middleware/*': './src/middleware/*'
'#models/*': './src/models/*'
'#routes/*': './src/routes/*'
'#services/*': './src/services/*'
'#utils/*': './src/utils/*'
'#validations/*': './src/validations/*'
```

### Key Components

**Database Configuration** (`src/config/database.js`):
- Uses `@neondatabase/serverless` with Drizzle ORM
- Exports `db` (Drizzle instance) and `sql` (Neon client)

**Authentication Flow**:
1. Routes (`#routes/auth.routes.js`) → Controllers (`#controllers/auth.controller.js`)
2. Controllers validate with Zod schemas (`#validations/auth.validation.js`)
3. Business logic in Services (`#services/auth.service.js`)
4. JWT utilities (`#utils/jwt.js`) and cookie management (`#utils/cookies.js`)

**Models** (`src/models/`):
- Drizzle schema definitions (currently only `user.model.js`)
- Uses `pgTable` with serial IDs, varchar fields, and timestamps

**Logging** (`src/config/logger.js`):
- Winston logger with JSON format for production
- File logging to `logs/` directory (error.log, combined.log)
- Console logging in development with colorization

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (change from default!)

### Development Notes
- The app uses strict ESLint rules (2-space indentation, single quotes, semicolons required)
- Cookie settings automatically adjust for production (secure flag)
- Database schema changes require running `npm run db:generate` then `npm run db:migrate`
- Health check available at `/health` endpoint