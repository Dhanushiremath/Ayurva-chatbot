# Start Rasa servers for Ayurva
Write-Host "Starting Ayurva Rasa Servers..." -ForegroundColor Cyan

# Activate virtual environment
$botDir = "c:\Users\DELL\Desktop\final_year_project\backend\rasa-bot"
cd $botDir
& .\rasa-env\Scripts\Activate.ps1

# Start action server in background
Write-Host "Starting Rasa Action Server on port 5055..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$botDir'; .\rasa-env\Scripts\Activate.ps1; rasa run actions"

# Wait a bit for action server to start
Start-Sleep -Seconds 5

# Start Rasa server
Write-Host "Starting Rasa API Server on port 5005..." -ForegroundColor Yellow
Write-Host "Rasa is ready when you see: 'Rasa server is up and running'" -ForegroundColor Green
rasa run --enable-api --cors "*" --port 5005
