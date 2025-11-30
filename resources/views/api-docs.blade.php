<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }

        *,
        *:before,
        *:after {
            box-sizing: inherit;
        }

        body {
            margin: 0;
            background: #fafafa;
        }

        .swagger-ui .topbar {
            display: none;
        }

        .swagger-ui .info {
            margin: 30px 0;
        }

        .swagger-ui .info .title {
            color: #3b82f6;
        }

        .swagger-ui .scheme-container {
            background: #fff;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .swagger-ui .opblock.opblock-get .opblock-summary-method {
            background: #22c55e;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary-method {
            background: #3b82f6;
        }

        .swagger-ui .opblock.opblock-put .opblock-summary-method {
            background: #f59e0b;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
            background: #ef4444;
        }

        .swagger-ui .btn.authorize {
            background-color: #3b82f6;
            border-color: #3b82f6;
            color: #fff;
        }

        .swagger-ui .btn.authorize:hover {
            background-color: #2563eb;
            border-color: #2563eb;
        }

        .swagger-ui .btn.execute {
            background-color: #3b82f6;
            border-color: #3b82f6;
        }

        .swagger-ui .btn.execute:hover {
            background-color: #2563eb;
            border-color: #2563eb;
        }

        /* Custom header */
        .api-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 20px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .api-header h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .api-header a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            opacity: 0.9;
            transition: opacity 0.2s;
        }

        .api-header a:hover {
            opacity: 1;
        }

        .api-header svg {
            width: 16px;
            height: 16px;
        }
    </style>
</head>
<body>
    <div class="api-header">
        <h1>{{ config('app.name') }} API Documentation</h1>
        <a href="{{ url('/dashboard') }}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
        </a>
    </div>

    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
    <script>
        window.onload = function() {
            window.ui = SwaggerUIBundle({
                url: "{{ url('/openapi.json') }}",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
                displayRequestDuration: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 2
            });
        };
    </script>
</body>
</html>
