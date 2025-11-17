# Network Access Configuration for ACE Billing & Admission

## Current Network Setup
- **Server IP**: 172.16.2.196
- **Port**: 9000
- **MAMP Document Root**: cas_billing/public
- **Access URL**: http://172.16.2.196:9000

## Configurations Applied

### 1. Environment Variables (.env)
```env
APP_URL=http://172.16.2.196:9000
SESSION_DOMAIN=172.16.2.196
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax
```

### 2. Vite Configuration (vite.config.ts)
- Server configured to listen on all network interfaces (0.0.0.0)
- HMR (Hot Module Replacement) set to use your IP address
- Port: 5173 for development

## Accessing the Application from Other Computers

### For Users on the Same Network:
1. Open any web browser
2. Navigate to: **http://172.16.2.196:9000**
3. You should see the login page with the ACE logo

### Important Notes:

#### Windows Firewall (If you're on Windows):
Make sure MAMP Pro and port 9000 are allowed through the firewall:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port 9000 → Next
6. Select "Allow the connection" → Next
7. Apply to all network types → Next
8. Name it "MAMP Pro - Port 9000" → Finish

#### MAMP Pro Settings:
1. **Hosts Configuration**:
   - Go to MAMP PRO → Hosts
   - Make sure your host is configured with:
     - Server Name: 172.16.2.196 (or your preferred domain)
     - Port: 9000
     - Document Root: /path/to/cas_billing/public

2. **Network Settings**:
   - Ensure Apache is set to listen on 0.0.0.0:9000 (all interfaces)
   - Check the Apache configuration if needed

#### Laravel Storage:
Make sure the storage is linked:
```bash
php artisan storage:link
```

#### After Changes:
Always clear cache after making configuration changes:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## Testing Network Access

### From the Server Computer:
```
http://172.16.2.196:9000
http://localhost:9000
```

### From Other Computers on the Network:
```
http://172.16.2.196:9000
```

### Troubleshooting:

1. **Can't access from other computers?**
   - Check Windows Firewall settings
   - Verify MAMP is running
   - Ping the server: `ping 172.16.2.196`
   - Check if port 9000 is listening: `netstat -an | findstr 9000`

2. **Sessions not working?**
   - Clear browser cookies
   - Check SESSION_DOMAIN in .env
   - Verify database connection

3. **Assets not loading?**
   - Run: `npm run build`
   - Check APP_URL matches your IP and port
   - Clear Laravel cache

4. **Get IP Address of other computers:**
   ```bash
   # Windows
   ipconfig
   
   # Look for IPv4 Address under your network adapter
   ```

## Default Login Credentials

Check your database seeders for default accounts. Typical roles:
- **Admin**: admin@example.com
- **Billing**: billing@example.com
- **Admitting**: admitting@example.com

Password: Usually set in DatabaseSeeder.php

## Security Recommendations

For production deployment:
1. Change APP_ENV to 'production'
2. Set APP_DEBUG to false
3. Use HTTPS with SSL certificate
4. Change all default passwords
5. Set strong APP_KEY
6. Configure proper firewall rules
7. Use environment-specific .env files

## Network Diagram

```
┌─────────────────────────────────────┐
│  Your Network (e.g., 172.16.2.x)    │
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │ Server PC    │  │ Client PC 1  ││
│  │ 172.16.2.196 │  │ 172.16.2.x   ││
│  │ Port: 9000   │  │              ││
│  │ (MAMP PRO)   │  │  Browser →   ││
│  └──────────────┘  └──────────────┘│
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │ Client PC 2  │  │ Client PC 3  ││
│  │ 172.16.2.x   │  │ 172.16.2.x   ││
│  │              │  │              ││
│  │  Browser →   │  │  Browser →   ││
│  └──────────────┘  └──────────────┘│
│                                     │
│  All access: http://172.16.2.196:9000
└─────────────────────────────────────┘
```

## Quick Commands Reference

```bash
# Clear all Laravel caches
php artisan optimize:clear

# Rebuild assets
npm run build

# Check Laravel configuration
php artisan config:show

# View current routes
php artisan route:list

# Check database connection
php artisan migrate:status

# Create storage symlink
php artisan storage:link
```

## Support

For issues, check:
1. MAMP PRO logs
2. Laravel logs: storage/logs/laravel.log
3. Browser console for JavaScript errors
4. Network tab in browser DevTools
