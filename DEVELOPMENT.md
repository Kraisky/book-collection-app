# Book Collection Manager - Deployment Guide

## Quick Production Deployment (Linux Server)

### Prerequisites
- Docker & Docker Compose installed on Linux server
- Git (optional, for cloning)
- SSH access to server

### Step 1: Transfer Project to Server

**Via Git (Recommended):**
```bash
# Push project to GitHub/GitLab first, then on server:
git clone <your-repo-url> book-collection-app
cd book-collection-app
```

**Via SCP:**
```bash
scp -r ".\*" user@192.168.2.40:/home/user/book-collection-app
```

### Step 2: Start on Linux Server

```bash
ssh user@192.168.2.40

cd book-collection-app

# Start in production mode
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access the App

```
Frontend: http://192.168.2.40:3000
Backend API: http://192.168.2.40:3001
```

## Production Configuration

The `docker-compose.yml` includes:

✅ **Auto-restart** - Containers restart after reboot  
✅ **Health checks** - Monitors service availability  
✅ **Resource limits** - Prevents runaway memory/CPU  
✅ **Log rotation** - Limits disk usage (max 10MB per log)  
✅ **Volume persistence** - Database survives container restarts  

## Stopping/Restarting

```bash
# Stop all containers
docker-compose stop

# Restart
docker-compose start

# Full restart (clean)
docker-compose restart

# Remove everything
docker-compose down
```

## Monitoring

```bash
# View real-time logs
docker-compose logs -f

# Check specific service
docker-compose logs backend
docker-compose logs frontend

# Container stats
docker stats

# Disk usage
du -sh book-collection-app/data/
```

## Backup Database

```bash
# Backup SQLite database
cp book-collection-app/data/books.db ~/backups/books.db.$(date +%Y%m%d)

# Or with volumes:
docker run --rm -v book-collection-app_app-data:/data \
  -v ~/backups:/backup alpine \
  tar czf /backup/books-backup-$(date +%Y%m%d).tar.gz /data
```

## Update Application

```bash
cd book-collection-app

# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or force rebuild
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Port conflicts
If 3000 or 3001 are in use, modify docker-compose.yml:
```yaml
ports:
  - "8080:80"    # Map to 8080 instead of 3000
```

### Logs show errors
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild from scratch
```bash
docker-compose down -v     # Remove volumes
docker-compose up -d --build
```

### Check disk space
```bash
df -h
docker system prune  # Clean up unused images/volumes
```

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev  # Starts on port 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Starts on port 3000
```

## Configuration

1. Open app at `http://192.168.2.40:3000`
2. Click **Settings**
3. Enter SMB path: `\\your-nas-ip\ShareName`
4. Enter username and password
5. Click **Sync from SMB** to import books

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/config` - Get SMB config
- `POST /api/config` - Save SMB config
- `POST /api/metadata/search` - Search metadata
- `POST /api/metadata/fetch/:bookId` - Fetch metadata
- `POST /api/sync/scan` - Scan SMB and import

## Performance Tips

- Run on dedicated Linux server for best performance
- Monitor `docker stats` during initial sync
- Use SSD for `/data` volume if possible
- Consider setting up automatic backups

## Remote Access (Advanced)

To access from outside your network:

```yaml
# Option 1: Nginx reverse proxy
# Option 2: Cloudflare tunnel
# Option 3: SSH port forward
ssh -L 3000:localhost:3000 user@192.168.2.40
```

Then access at `http://localhost:3000`
