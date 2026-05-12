.PHONY: help start stop restart logs status backup update health clean build

help:
	@echo "Book Collection App - Available Commands"
	@echo ""
	@echo "  make start         - Start the application"
	@echo "  make stop          - Stop the application"
	@echo "  make restart       - Restart the application"
	@echo "  make logs          - View all logs (follow mode)"
	@echo "  make logs-backend  - View backend logs only"
	@echo "  make logs-frontend - View frontend logs only"
	@echo "  make status        - Check service status"
	@echo "  make backup        - Backup the database"
	@echo "  make update        - Update code and rebuild"
	@echo "  make health        - Run health checks"
	@echo "  make clean         - Stop all containers"
	@echo "  make build         - Rebuild containers"
	@echo "  make help          - Show this help message"

start:
	@echo "Starting Book Collection App..."
	docker-compose up -d
	@sleep 2
	@docker-compose ps
	@echo "✓ App started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001"

stop:
	@echo "Stopping Book Collection App..."
	docker-compose stop
	@echo "✓ Stopped"

restart:
	@echo "Restarting Book Collection App..."
	docker-compose restart
	@sleep 2
	@docker-compose ps
	@echo "✓ Restarted"

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

status:
	@echo "Service Status:"
	@docker-compose ps
	@echo ""
	@echo "Container Stats:"
	@docker stats --no-stream

backup:
	@echo "Backing up database..."
	@mkdir -p backups
	@cp data/books.db backups/books_$$(date +%Y%m%d_%H%M%S).db
	@echo "✓ Backup created in backups/"

update:
	@echo "Pulling latest code..."
	git pull
	@echo "Rebuilding containers..."
	docker-compose down
	docker-compose up -d --build
	@sleep 2
	@docker-compose ps
	@echo "✓ Updated"

health:
	@echo "Running health checks..."
	@curl -s http://localhost:3001/health || echo "Backend: ERROR"
	@echo ""
	@curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://localhost:3000

clean:
	@echo "Stopping all containers..."
	docker-compose down
	@echo "✓ Cleaned"

build:
	@echo "Building containers..."
	docker-compose build --no-cache
	@echo "✓ Build complete"
