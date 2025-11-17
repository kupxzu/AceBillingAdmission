# Enable Network Access for ACE Billing & Admission
# Run this script as Administrator

Write-Host "=== ACE Billing & Admission - Network Access Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Add Firewall Rule for Port 9000
Write-Host "Adding Windows Firewall rule for Port 9000..." -ForegroundColor Yellow

try {
    # Remove existing rule if it exists
    Remove-NetFirewallRule -DisplayName "ACE Billing - Port 9000" -ErrorAction SilentlyContinue
    
    # Add new inbound rule
    New-NetFirewallRule -DisplayName "ACE Billing - Port 9000" `
        -Direction Inbound `
        -LocalPort 9000 `
        -Protocol TCP `
        -Action Allow `
        -Profile Any `
        -Enabled True `
        -Description "Allow incoming connections to ACE Billing & Admission system on port 9000"
    
    Write-Host "✓ Firewall rule added successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to add firewall rule: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Add Firewall Rule for Apache (MAMP)
Write-Host "Adding Windows Firewall rule for Apache..." -ForegroundColor Yellow

try {
    # Get MAMP Apache path (common locations)
    $mampPaths = @(
        "C:\MAMP\bin\apache\bin\httpd.exe",
        "C:\MAMP PRO\bin\apache\bin\httpd.exe",
        "D:\MAMP\bin\apache\bin\httpd.exe",
        "D:\MAMP PRO\bin\apache\bin\httpd.exe"
    )
    
    $apachePath = $null
    foreach ($path in $mampPaths) {
        if (Test-Path $path) {
            $apachePath = $path
            break
        }
    }
    
    if ($apachePath) {
        # Remove existing rule if it exists
        Remove-NetFirewallRule -DisplayName "MAMP Apache HTTP Server" -ErrorAction SilentlyContinue
        
        # Add program rule
        New-NetFirewallRule -DisplayName "MAMP Apache HTTP Server" `
            -Direction Inbound `
            -Program $apachePath `
            -Action Allow `
            -Profile Any `
            -Enabled True `
            -Description "Allow MAMP Apache to accept incoming connections"
        
        Write-Host "✓ Apache firewall rule added for: $apachePath" -ForegroundColor Green
    } else {
        Write-Host "! Apache not found in common MAMP locations. You may need to add this rule manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Failed to add Apache firewall rule: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Testing Network Access ===" -ForegroundColor Cyan
Write-Host ""

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Select-Object -First 1).IPAddress

Write-Host "Your Server IP: $localIP" -ForegroundColor White
Write-Host "Port: 9000" -ForegroundColor White
Write-Host ""

# Test local access
Write-Host "Testing local access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$localIP:9000" -Method Head -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Server is accessible locally!" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Cannot access server locally: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Access URLs ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "From this computer:" -ForegroundColor White
Write-Host "  - http://a.test:9000" -ForegroundColor Cyan
Write-Host "  - http://$localIP:9000" -ForegroundColor Cyan
Write-Host "  - http://localhost:9000" -ForegroundColor Cyan
Write-Host ""
Write-Host "From other computers on your network:" -ForegroundColor White
Write-Host "  - http://$localIP:9000" -ForegroundColor Green
Write-Host ""
Write-Host "=== Important Reminders ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure 'for MAMP Viewer (LAN only)' is CHECKED in MAMP Pro" -ForegroundColor Yellow
Write-Host "2. Restart MAMP Pro after checking the LAN option" -ForegroundColor Yellow
Write-Host "3. Make sure all computers are on the same network" -ForegroundColor Yellow
Write-Host "4. Test from another computer using: http://$localIP:9000" -ForegroundColor Yellow
Write-Host ""

# List current firewall rules
Write-Host "Current Firewall Rules:" -ForegroundColor Cyan
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*ACE*" -or $_.DisplayName -like "*MAMP*"} | 
    Select-Object DisplayName, Enabled, Direction, Action | Format-Table -AutoSize

Write-Host ""
Write-Host "Setup complete! Press Enter to exit..." -ForegroundColor Green
Read-Host
