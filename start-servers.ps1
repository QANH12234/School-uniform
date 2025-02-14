# Start MongoDB (if not running)
try {
    Start-Service MongoDB
} catch {
    Write-Host "MongoDB service not found or couldn't be started. Make sure MongoDB is installed."
}

# Start backend server
Start-Process powershell -ArgumentList "-NoExit -Command cd backend; npm run dev"

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit -Command cd frontend; npm start" 