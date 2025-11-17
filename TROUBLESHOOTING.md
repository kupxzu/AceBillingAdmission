# Quick Network Access Troubleshooting

## Current Status
✓ Server is running on 172.16.2.196:9000
✓ Application responds with HTTP 200 OK
✓ Port 9000 is listening
⚠️ Other computers cannot access (likely firewall issue)

## Solution: Run the Firewall Setup Script

### Step 1: Open PowerShell as Administrator
1. Press `Windows + X`
2. Click "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. If prompted by UAC, click "Yes"

### Step 2: Navigate to Project Folder
```powershell
cd "D:\carl supan file\AceBillingAdmission"
```

### Step 3: Run the Script
```powershell
.\enable-network-access.ps1
```

This script will:
- ✓ Add Windows Firewall rule for port 9000
- ✓ Add Windows Firewall rule for MAMP Apache
- ✓ Test local access
- ✓ Show you the access URLs

## Manual Firewall Setup (Alternative)

If you prefer to do it manually:

### Add Port 9000 Rule:
```powershell
New-NetFirewallRule -DisplayName "ACE Billing - Port 9000" -Direction Inbound -LocalPort 9000 -Protocol TCP -Action Allow -Profile Any
```

### Or use Windows Firewall GUI:
1. Press `Windows + R`, type `wf.msc`, press Enter
2. Click "Inbound Rules" → "New Rule"
3. Select "Port" → Next
4. Select "TCP", enter "9000" → Next
5. Select "Allow the connection" → Next
6. Check all profiles (Domain, Private, Public) → Next
7. Name: "ACE Billing - Port 9000" → Finish

## MAMP Pro Settings Checklist

Make sure in MAMP Pro:
- [x] Host name: a.test
- [x] IP address: 172.16.2.196
- [x] Port: 9000
- [x] Document root: D:\carl supan file\AceBillingAdmission\public
- [x] "via hosts file (this PC only)" - CHECKED
- [x] **"for MAMP Viewer (LAN only)" - MUST BE CHECKED** ⚠️
- [x] Click Save
- [x] Restart MAMP Pro

## Testing Access

### From Your Server Computer:
Open browser and test these URLs:
- http://172.16.2.196:9000
- http://a.test:9000
- http://localhost:9000

All should work!

### From Another Computer on Network:
1. Make sure it's on the same network (172.16.2.x)
2. Open browser
3. Go to: http://172.16.2.196:9000

## Common Issues

### Issue 1: "This site can't be reached"
**Solution:** 
- Check Windows Firewall (run the script above)
- Verify MAMP "LAN only" checkbox is enabled
- Restart MAMP Pro

### Issue 2: "Connection refused"
**Solution:**
- Make sure MAMP Pro is running
- Check if port 9000 is correct in both MAMP and .env
- Restart Apache in MAMP

### Issue 3: Page loads but no CSS/images
**Solution:**
```powershell
cd "D:\carl supan file\AceBillingAdmission"
npm run build
php artisan storage:link
php artisan config:clear
```

### Issue 4: Login doesn't work from other computers
**Solution:**
Check your .env file has:
```
SESSION_DOMAIN=172.16.2.196
SESSION_SECURE_COOKIE=false
```

Then clear cache:
```powershell
php artisan config:clear
php artisan cache:clear
```

## Verify Network Configuration

### Check if port is listening:
```powershell
netstat -an | Select-String "9000"
```
Should show: `TCP    172.16.2.196:9000      0.0.0.0:0              LISTENING`

### Test connection:
```powershell
Test-NetConnection -ComputerName 172.16.2.196 -Port 9000
```
Should show: `TcpTestSucceeded : True`

### Get your IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Quick Reset

If things still don't work, try this complete reset:

```powershell
# Clear all Laravel caches
php artisan optimize:clear

# Rebuild assets
npm run build

# Restart MAMP Pro (stop and start servers)

# Test access
Invoke-WebRequest -Uri "http://172.16.2.196:9000" -Method Head -UseBasicParsing
```

## Network Diagram

```
Your Network: 172.16.2.x

┌─────────────────────┐         ┌─────────────────────┐
│  Your Server PC     │         │  Other Computer     │
│  172.16.2.196:9000  │◄────────┤  172.16.2.x         │
│  (MAMP Pro)         │  HTTP   │  (Browser)          │
└─────────────────────┘         └─────────────────────┘
         ▲
         │
    Firewall must
    allow port 9000!
```

## Still Not Working?

Check:
1. Are both computers on the same Wi-Fi/network?
2. Is antivirus blocking connections?
3. Is MAMP Pro actually running?
4. Did you save and restart MAMP after enabling LAN option?
5. Did you run the firewall script as Administrator?

## Contact Info
If you need to share this setup with your team, the access URL is:
**http://172.16.2.196:9000**

Everyone on network 172.16.2.x can access it!
