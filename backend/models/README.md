## Deprecated Models

These Mongoose model files are no longer used. The application has migrated to **PostgreSQL with Prisma ORM**.

**Migration Details:**
- **User.js** → Replaced by Prisma model in `prisma/schema.prisma`
- **Booking.js** → Replaced by Prisma models (Booking + Vehicle) in `prisma/schema.prisma`

**For future updates:**
- Modify data models in `backend/prisma/schema.prisma`
- Run `npx prisma migrate dev --name <migration_name>` to create database migrations
- Query models using the Prisma Client in `backend/server.js`

**Reference:**
- Prisma Documentation: https://www.prisma.io/docs/
- Schema Location: `backend/prisma/schema.prisma`

These files are kept for reference only and can be deleted if no longer needed.
