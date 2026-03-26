# Rasa Installation Script for Ayurva
Write-Host "Setting up Rasa Environment for Ayurva..." -ForegroundColor Cyan

# Ensure we are in the correct directory
$botDir = "c:\Users\DELL\Desktop\final_year_project\backend\rasa-bot"
cd $botDir

# Check if rasa-env exists, create if not
if (-not (Test-Path "rasa-env")) {
    Write-Host "Creating virtual environment 'rasa-env'..." -ForegroundColor Yellow
    python -m venv rasa-env
}

# Activate environment and install Rasa
Write-Host "Installing Rasa and dependencies (this may take several minutes)..." -ForegroundColor Yellow
& .\rasa-env\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install rasa==3.6.15 rasa-sdk==3.6.2

if ($LASTEXITCODE -eq 0) {
    Write-Host "Rasa successfully installed!" -ForegroundColor Green
    Write-Host "To start, run: .\start-rasa.ps1" -ForegroundColor Cyan
} else {
    Write-Host "Installation failed. Please check your internet connection and Python version (3.10 recommended)." -ForegroundColor Red
}
