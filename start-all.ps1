# Start MongoDB (uncomment if MongoDB is not running as a service)
# Start-Process "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $connection = New-Object System.Net.Sockets.TcpClient
    try {
        $connection.Connect("localhost", $port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if required ports are available
$ports = @(4000, 5173, 5174)
foreach ($port in $ports) {
    if (Test-PortInUse $port) {
        Write-Host "Error: Port $port is already in use. Please free up this port before continuing."
        exit 1
    }
}

# Start Backend Server
Write-Host "Starting Backend Server..."
Start-Process powershell -ArgumentList "-NoExit -Command cd backend; npm start"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Admin Panel
Write-Host "Starting Admin Panel..."
Start-Process powershell -ArgumentList "-NoExit -Command cd admin; npm run dev"

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit -Command cd frontend; npm run dev"

Write-Host "All services started!"
Write-Host "Backend: http://localhost:4000"
Write-Host "Admin Panel: http://localhost:5173"
Write-Host "Frontend: http://localhost:5174" 