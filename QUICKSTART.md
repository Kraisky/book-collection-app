# 🚀 Quick Start - Linux Deployment

## Your Setup

```
Server: 192.168.2.40
OS: Linux
Docker: Installed
Docker Compose: Installed
```

## Step-by-Step Deployment

### 1. Get the Project on Your Server

**Option A: Via Git (Recommended)**
```bash
ssh user@192.168.2.40
git clone <your-repo-url> book-collection-app
cd book-collection-app
```

**Option B: Via SCP (from Windows)**
```powershell
scp -r "C:\Users\nuno6\iCloudDrive\01 Projects\Vibe Coding" user@192.168.2.40:/home/user/book-collection-app
```

### 2. Start the Application

```bash
cd book-collection-app
docker-compose up -d
```

**That's it! Your app is running.** ✨

### 3. Verify It's Running

```bash
docker-compose ps
```

You should see 2 containers running:
- books-app-backend
- books-app-frontend

### 4. Access the App

Open in your browser:
```
http://192.168.2.40:3000
```

## Configuration (First Time)

1. Click **Settings** button (top right)
2. Enter your SMB/Synology details:
   - **Share Path**: `\\192.168.1.100\Boeken` (your NAS IP and share)
   - **Username**: Your Synology username
   - **Password**: Your password
3. Click **Save**
4. Click **🔄 Sync from SMB** to scan your books

## Handy Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop the app
docker-compose stop

# Restart the app
docker-compose restart

# Check service status
docker-compose ps

# Backup your database
./deploy.sh backup    # On Linux
.\deploy.ps1 -Command backup  # On Windows
```

## Deployment Script

For easier management, use the provided scripts:

**Linux:**
```bash
chmod +x deploy.sh

./deploy.sh start     # Start
./deploy.sh stop      # Stop
./deploy.sh restart   # Restart
./deploy.sh logs      # View logs
./deploy.sh status    # Check status
./deploy.sh backup    # Backup database
./deploy.sh health    # Health check
```

**Windows (PowerShell):**
```powershell
.\deploy.ps1 -Command start
.\deploy.ps1 -Command logs -Service backend
.\deploy.ps1 -Command backup
```

## Access from Different IPs

The app will be available on:
- **Frontend**: `http://192.168.2.40:3000`
- **Backend API**: `http://192.168.2.40:3001`

From Windows, you can also do SSH tunneling:
```powershell
ssh -L 3000:localhost:3000 user@192.168.2.40
# Then access at http://localhost:3000
```

## Database Location

Your SQLite database is stored in:
```
book-collection-app/data/books.db
```

It persists automatically - all your book data is safe!

## Troubleshooting

### App won't start
```bash
# Check if ports are free
sudo netstat -tulpn | grep 3000
sudo netstat -tulpn | grep 3001

# Check Docker logs
docker-compose logs
```

### Can't connect to SMB
- Verify NAS IP and share name
- Check firewall allows SMB (port 445)
- Test from Linux server: `smbclient -L //nas-ip/share -U username`

### Out of memory
The docker-compose.yml limits resources to 512MB backend, 256MB frontend.
If needed, increase in docker-compose.yml

## Next Steps

- Read the full [README.md](README.md) for more features
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for advanced setup
- Use `./deploy.sh health` to monitor service health

## Support

If you get an error, share the output of:
```bash
docker-compose logs
docker-compose ps
```

---

**That's it! Your Book Collection App is now running on 192.168.2.40:3000** 📚✨
