# PostgreSQL + Prisma Migration - Setup Guide

## Migration Completed ✅

Your backend has been successfully migrated from **MongoDB to PostgreSQL** using **Prisma ORM**. 

### What Was Changed

1. **Dependencies Updated**
   - Removed: `mongoose`
   - Added: `@prisma/client`, `prisma`, `pg`, `node-cron`, `dotenv`

2. **Database Schema**
   - Created: `backend/prisma/schema.prisma` with normalized database models
   - **User model**: Authentication with encrypted passwords
   - **Booking model**: Normalized with separate Vehicle table for better relationships
   - **Vehicle model**: Separate table linked to Booking via foreign key
   - **RefreshToken model**: Persistent token storage in database

3. **Refactored server.js**
   - Replaced Mongoose with Prisma Client
   - Updated all database operations (CRUD)
   - Fixed authentication flow with password hashing via bcrypt
   - Moved refresh tokens from in-memory to database storage
   - Replaced setTimeout with node-cron for auto-expiration of pending bookings
   - Added graceful shutdown

4. **Environment Variables**
   - Changed: `MONGO_URI` → `DATABASE_URL`
   - Format: `postgresql://user:password@localhost:5432/database_name`

---

## Next Steps: PostgreSQL Setup

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- During installation, remember the password for the `postgres` user
- Installation creates a service that runs automatically

**Verify Installation:**
```powershell
psql --version
```

### 2. Create Database

```bash
# Connect to PostgreSQL (requires postgres password)
psql -U postgres

# Create database for the project
CREATE DATABASE mobile_detailing;

# Exit psql
\q
```

### 3. Update .env File

Edit `backend/.env` and update the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mobile_detailing
HELCIM_API_TOKEN=your_helcim_api_token_here
HELCIM_API_BASE_URL=https://api.helcim.com/v2/
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
```

Replace:
- `your_password` with your PostgreSQL password
- `your_helcim_api_token_here` with your actual Helcim API token (from your Helcim merchant dashboard)
- Keep other values as-is (update secrets in production)

### 4. Run Prisma Migration

```bash
cd backend
npx prisma migrate dev --name init
```

This command will:
- Create all tables in PostgreSQL
- Generate migration files
- Populate Prisma client

### 5. Start the Backend

```bash
npm run dev
```

Expected output:
```
✅ Connected to PostgreSQL
Server running at http://localhost:5000
```

---

## Prisma Useful Commands

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Push schema to database without creating migration
npx prisma db push

# View/manage database in Prisma Studio
npx prisma studio

# Generate Prisma client (auto-run after migrations)
npx prisma generate

# Seed database (if seed.ts exists)
npx prisma db seed
```

---

## Key Improvements from Migration

✅ **Type Safety**: Prisma provides TypeScript types for all database queries  
✅ **Cleaner SQL**: Auto-generated, optimized SQL queries  
✅ **Better Relationships**: Normalized schema with proper foreign keys  
✅ **Persistent State**: Refresh tokens stored in database, survives server restarts  
✅ **Auto-Expiration**: Reliable cron-based cleanup of expired bookings  
✅ **Easy Migrations**: Version-controlled schema changes  
✅ **Performance**: Indexes on frequently queried fields (date, time, userId, status)



## Troubleshooting

### "Can't reach database server at localhost:5432"
- Make sure PostgreSQL is installed and running
- Check `DATABASE_URL` in `.env` file is correct
- Test connection: `psql -U postgres -d mobile_detailing`

### "Database does not exist"
- Run: `npx prisma migrate dev --name init`
- This creates the database schema

### "Port 5000 already in use"
- Clear `PORT` in `.env` or use a different port: `PORT=5001`
- Or kill the process using port 5000

### Connection refused errors
- Verify PostgreSQL is running (Windows Services)
- On Windows: Start → Services → PostgreSQL → Properties → set to Automatic

---

## Production Checklist

Before deploying to production:

- [ ] Change JWT secrets in `.env`
- [ ] Use a strong PostgreSQL password
- [ ] Set up PostgreSQL backups
- [ ] Enable SSL for database connection
- [ ] Use environment-specific `.env` files
- [ ] Run `npm audit fix` to fix vulnerabilities
- [ ] Test all API endpoints with real data
- [ ] Set up proper error logging

---

## Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `backend/package.json` | Updated | Added Prisma, PostgreSQL dependencies |
| `backend/server.js` | Refactored | Complete rewrite using Prisma |
| `backend/prisma/schema.prisma` | Created | Database schema definition |
| `backend/.env` | Updated | Changed MONGO_URI to DATABASE_URL |
| `backend/models/README.md` | Created | Deprecation notice for old models |

---

## Need More Help?

- Prisma Documentation: https://www.prisma.io/docs/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- This project: Check `backend/prisma/schema.prisma` for current schema

Happy coding! 🚀
