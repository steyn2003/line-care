<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'LineCare Notification')</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-body h2 {
            color: #667eea;
            font-size: 20px;
            margin-top: 0;
        }
        .notification-card {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .notification-card.warning {
            border-left-color: #f59e0b;
            background-color: #fffbeb;
        }
        .notification-card.critical {
            border-left-color: #ef4444;
            background-color: #fef2f2;
        }
        .notification-card.success {
            border-left-color: #10b981;
            background-color: #f0fdf4;
        }
        .info-row {
            margin: 10px 0;
        }
        .info-label {
            font-weight: 600;
            color: #666;
            display: inline-block;
            min-width: 120px;
        }
        .info-value {
            color: #333;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #667eea;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
        }
        .button:hover {
            background-color: #5568d3;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>LineCare</h1>
        </div>
        <div class="email-body">
            @yield('content')
        </div>
        <div class="email-footer">
            <p>
                This is an automated notification from LineCare.<br>
                If you have questions, please contact your system administrator.
            </p>
            <p>
                <a href="{{ config('app.url') }}">Visit LineCare</a>
            </p>
        </div>
    </div>
</body>
</html>
