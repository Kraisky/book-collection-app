# Book Collection App - Deployment Helper Script (Windows)
# Usage: .\deploy.ps1 -Command start

param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'backup', 'update', 'health')]
    [string]$Command = 'start',
    
    [Parameter(Position=1)]
    [string]$Service = $null
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackupDir = Join-Path $ScriptDir "backups"
$DataDir = Join-Path $ScriptDir "data"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Error-Msg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning-Msg {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Start-App {
    Write-Info "Starting Book Collection App..."
    docker-compose up -d
    Start-Sleep -Seconds 2
    docker-compose ps
    Write-Info "✓ App started successfully!"
    Write-Info "Frontend: http://localhost:3000"
    Write-Info "Backend: http://localhost:3001"
}

function Stop-App {
    Write-Info "Stopping Book Collection App..."
    docker-compose stop
    Write-Info "✓ App stopped"
}

function Restart-App {
    Write-Info "Restarting Book Collection App..."
    docker-compose restart
    Start-Sleep -Seconds 2
    docker-compose ps
    Write-Info "✓ App restarted"
}

function Show-Logs {
    if ($Service) {
        docker-compose logs -f $Service
    } else {
        docker-compose logs -f
    }
}

function Show-Status {
    Write-Info "Checking service status..."
    docker-compose ps
    Write-Info ""
    Write-Info "Container stats:"
    docker stats --no-stream
}

function Backup-Database {
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupFile = Join-Path $BackupDir "books_${Timestamp}.db"
    
    Write-Info "Backing up database..."
    
    $DbPath = Join-Path $DataDir "books.db"
    if (Test-Path $DbPath) {
        Copy-Item $DbPath $BackupFile
        Write-Info "✓ Backup created: $BackupFile"
    } else {
        Write-Error-Msg "Database not found at $DbPath"
        exit 1
    }
}

function Update-App {
    Write-Info "Pulling latest code..."
    git pull
    
    Write-Info "Rebuilding containers..."
    docker-compose down
    docker-compose up -d --build
    
    Start-Sleep -Seconds 2
    docker-compose ps
    Write-Info "✓ Update completed"
}

function Health-Check {
    Write-Info "Running health checks..."
    
    try {
        $BackendHealth = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
        Write-Info "Backend: $($BackendHealth.Content)"
    } catch {
        Write-Info "Backend: ERROR - $_"
    }
    
    try {
        $FrontendStatus = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
        Write-Info "Frontend HTTP Status: $($FrontendStatus.StatusCode)"
    } catch {
        Write-Info "Frontend: ERROR - $_"
    }
}

# Execute command
switch ($Command) {
    'start'   { Start-App }
    'stop'    { Stop-App }
    'restart' { Restart-App }
    'logs'    { Show-Logs }
    'status'  { Show-Status }
    'backup'  { Backup-Database }
    'update'  { Update-App }
    'health'  { Health-Check }
    default {
        Write-Host "Book Collection App - Deployment Helper (Windows)"
        Write-Host ""
        Write-Host "Usage: .\deploy.ps1 -Command <command> [-Service <service>]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  start              - Start the application"
        Write-Host "  stop               - Stop the application"
        Write-Host "  restart            - Restart the application"
        Write-Host "  logs               - View all logs (use -Service backend|frontend for specific)"
        Write-Host "  status             - Check service status"
        Write-Host "  backup             - Backup the database"
        Write-Host "  update             - Update code and rebuild"
        Write-Host "  health             - Run health checks"
        Write-Host ""
        Write-Host "Examples:"
        Write-Host "  .\deploy.ps1 -Command start"
        Write-Host "  .\deploy.ps1 -Command logs -Service backend"
        Write-Host "  .\deploy.ps1 -Command backup"
    }
}
