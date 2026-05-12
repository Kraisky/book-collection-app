#!/bin/bash

# Book Collection App - Deployment Helper Script
# Usage: ./deploy.sh [command]
# Commands: start, stop, restart, logs, status, backup, update

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="book-collection-app"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Start the application
start() {
    log_info "Starting Book Collection App..."
    docker-compose up -d
    sleep 2
    docker-compose ps
    log_info "✓ App started successfully!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:3001"
}

# Stop the application
stop() {
    log_info "Stopping Book Collection App..."
    docker-compose stop
    log_info "✓ App stopped"
}

# Restart the application
restart() {
    log_info "Restarting Book Collection App..."
    docker-compose restart
    sleep 2
    docker-compose ps
    log_info "✓ App restarted"
}

# View logs
logs() {
    if [ "$1" = "backend" ]; then
        docker-compose logs -f backend
    elif [ "$1" = "frontend" ]; then
        docker-compose logs -f frontend
    else
        docker-compose logs -f
    fi
}

# Check status
status() {
    log_info "Checking service status..."
    docker-compose ps
    log_info ""
    log_info "Container stats:"
    docker stats --no-stream
}

# Backup database
backup() {
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="${BACKUP_DIR}/books_${TIMESTAMP}.db"
    
    log_info "Backing up database..."
    
    if [ -f "${SCRIPT_DIR}/data/books.db" ]; then
        cp "${SCRIPT_DIR}/data/books.db" "$BACKUP_FILE"
        log_info "✓ Backup created: $BACKUP_FILE"
    else
        log_error "Database not found!"
        exit 1
    fi
}

# Update and rebuild
update() {
    log_info "Pulling latest code..."
    git pull
    
    log_info "Rebuilding containers..."
    docker-compose down
    docker-compose up -d --build
    
    sleep 2
    docker-compose ps
    log_info "✓ Update completed"
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    BACKEND_HEALTH=$(curl -s http://localhost:3001/health || echo '{"status":"error"}')
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    
    log_info "Backend: $BACKEND_HEALTH"
    log_info "Frontend HTTP Status: $FRONTEND_STATUS"
}

# Main command handling
case "${1:-start}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    backup)
        backup
        ;;
    update)
        update
        ;;
    health)
        health_check
        ;;
    *)
        echo "Book Collection App - Deployment Helper"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start              - Start the application"
        echo "  stop               - Stop the application"
        echo "  restart            - Restart the application"
        echo "  logs [service]     - View logs (service: backend, frontend, or all)"
        echo "  status             - Check service status"
        echo "  backup             - Backup the database"
        echo "  update             - Update code and rebuild"
        echo "  health             - Run health checks"
        echo ""
        exit 1
        ;;
esac
