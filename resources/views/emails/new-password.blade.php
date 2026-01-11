<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your New Password</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 24px;
        }
        .password-box {
            background-color: #f8f9fa;
            border: 2px dashed #0066cc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .password {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            letter-spacing: 2px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ACEMC Billing System</h1>
        </div>
        
        <p>Hello <strong>{{ $userName }}</strong>,</p>
        
        <p>Your password has been reset by an administrator. Below is your new temporary password:</p>
        
        <div class="password-box">
            <p style="margin: 0 0 10px 0; color: #666;">Your New Password</p>
            <span class="password">{{ $newPassword }}</span>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important Security Notice:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Please log in and change this password immediately</li>
                <li>Do not share this password with anyone</li>
                <li>If you did not request this reset, please contact your administrator</li>
            </ul>
        </div>
        
        <p>You can log in to the system using your email address and the password above.</p>
        
        <div class="footer">
            <p>This is an automated message from the ACEMC Billing System.<br>
            Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} ACE Medical Center Tuguegarao</p>
        </div>
    </div>
</body>
</html>
