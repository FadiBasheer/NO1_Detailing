# Deployment Guide — Yumeeco

## Server Info
- **Provider:** OVHcloud
- **Backend directory:** `/var/www/backend`
- **Deploy script:** `/var/www/deploy.sh`

---

## Deploying Code Changes (no database changes)

```bash
ssh ubuntu@YOUR_SERVER_IP
cd /var/www && sudo ./deploy.sh
```

---

## Deploying Database Changes (schema updates)

Follow these steps in order every time you modify `prisma/schema.prisma`.

### 1. Make your schema changes locally
Edit `backend/prisma/schema.prisma` with the new fields or models.

### 2. Stop the local backend, then create the migration
```bash
npx prisma migrate dev --name describe_your_change
```
This generates a new SQL file inside `prisma/migrations/`. Always use a descriptive name (e.g. `add_phone_to_user`, `add_notes_to_booking`).

### 3. Commit and push
```bash
git add prisma/migrations prisma/schema.prisma
git commit -m "your message"
git push
```

### 4. SSH into the server, deploy, then apply the migration
```bash
ssh ubuntu@YOUR_SERVER_IP
cd /var/www && sudo ./deploy.sh
cd /var/www/backend && node_modules/.bin/prisma migrate deploy
```

---

## Troubleshooting

### Deploy fails with "local changes would be overwritten"
The auto-generated Prisma client files are conflicting. Discard them and retry:
```bash
sudo git checkout -- backend/node_modules/.prisma/client/
sudo ./deploy.sh
```

### Prisma permission denied
The Prisma binary lost its executable permission. Fix it:
```bash
sudo chmod +x /var/www/backend/node_modules/.bin/prisma
```

---

## Key Prisma Commands

| Command | Where | What it does |
|---|---|---|
| `npx prisma migrate dev --name <name>` | Local only | Creates a new migration file |
| `node_modules/.bin/prisma migrate deploy` | Server only | Applies pending migrations |
| `npx prisma studio` | Local only | Opens a GUI to browse the database |
