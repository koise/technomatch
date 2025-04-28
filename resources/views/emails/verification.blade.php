<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #333;
            background-color: #f0f0f0;
            padding: 12px 20px;
            border-radius: 6px;
            margin: 30px 0;
            display: inline-block;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
        }
        .button {
            background-color: #ff312e;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering! To verify your email address, please use the following verification code:</p>
            
            <div class="code">{{ $code }}</div>
            
            <p>This verification code will expire at {{ $expires_at }}.</p>
            
            <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} TechnoMatch. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>