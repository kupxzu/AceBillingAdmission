@echo off
echo ============================================
echo   ACE Billing - Enable Network Access
echo ============================================
echo.
echo This script will add a Windows Firewall rule
echo to allow other computers to access your server.
echo.
echo Press any key to continue...
pause >nul

:: Request administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ERROR: This script requires Administrator privileges!
    echo.
    echo Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo [✓] Running as Administrator
echo.

:: Add firewall rule for port 9000
echo Adding Windows Firewall rule for Port 9000...
netsh advfirewall firewall delete rule name="ACE Billing - Port 9000" >nul 2>&1
netsh advfirewall firewall add rule name="ACE Billing - Port 9000" dir=in action=allow protocol=TCP localport=9000 profile=any

if %errorLevel% equ 0 (
    echo [✓] Firewall rule added successfully!
) else (
    echo [✗] Failed to add firewall rule
)

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Your server is now accessible at:
echo   http://172.16.2.196:9000
echo.
echo IMPORTANT REMINDERS:
echo 1. Check "for MAMP Viewer (LAN only)" in MAMP Pro
echo 2. Click Save and Restart MAMP Pro
echo 3. Test from another computer
echo.
echo ============================================
echo.
pause
