$botDir = "c:\Users\DELL\Desktop\final_year_project\backend\rasa-bot"
cd $botDir
$env:PYTHONUTF8 = '1'
& .\rasa-env\Scripts\Activate.ps1

Write-Host "🧪 Running Rasa NLU Evaluation..." -ForegroundColor Yellow
rasa test nlu --out grid_search_results

Write-Host "`n🧪 Running Rasa Core/Stories Evaluation..." -ForegroundColor Yellow
rasa test core --out grid_search_results

Write-Host "`n✅ Evaluation complete. Results saved in 'grid_search_results' folder." -ForegroundColor Green
