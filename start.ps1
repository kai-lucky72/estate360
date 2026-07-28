# Start backend
Write-Host "Starting backend..." -ForegroundColor Green
docker-compose up -d --build

# Wait for backend
Write-Host "Waiting for backend..." -ForegroundColor Yellow
do {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health/" -UseBasicParsing
        $status = $response.StatusCode
    } catch {
        $status = 0
    }
} while ($status -ne 200)

# Seed database
Write-Host "Seeding database..." -ForegroundColor Yellow
docker-compose exec -T web python manage.py shell -c "exec(open('seed_db.py').read())" 2>$null

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Green
Set-Location frontend
npm run dev
