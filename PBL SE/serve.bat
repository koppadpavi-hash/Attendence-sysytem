@echo off
title GM University Attendance Portal - Local Server (Port 8080)
echo ===================================================================
echo   GM UNIVERSITY ATTENDANCE PORTAL - LOCAL WEB SERVER
echo ===================================================================
echo.
echo Starting local static server on http://localhost:8080/ ...
echo Press Ctrl+C in this console to stop the server anytime.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $port = 8080; $folder = '%~dp0'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:' + $port + '/'); $listener.Start(); Write-Host 'Server running at http://localhost:8080/'; Start-Process ('http://localhost:' + $port + '/index.html'); while ($listener.IsListening) { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $urlPath = $req.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }; $filePath = Join-Path $folder $urlPath; if (Test-Path $filePath -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($filePath); $ext = [System.IO.Path]::GetExtension($filePath).ToLower(); $contentType = 'text/plain'; switch ($ext) { '.html' { $contentType = 'text/html' } '.css' { $contentType = 'text/css' } '.js' { $contentType = 'application/javascript' } '.svg' { $contentType = 'image/svg+xml' } '.csv' { $contentType = 'text/csv' } '.json' { $contentType = 'application/json' } }; $res.ContentType = $contentType; $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $res.StatusCode = 404; $err = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $res.OutputStream.Write($err, 0, $err.Length) }; $res.Close() } }"
