$ports = 3000, 5000, 5500, 8000, 8081, 8888, 9000
$folder = $PSScriptRoot
$listener = $null
$boundPort = 0

foreach ($p in $ports) {
    try {
        $candidate = New-Object System.Net.HttpListener
        $candidate.Prefixes.Add("http://localhost:$p/")
        $candidate.Start()
        $listener = $candidate
        $boundPort = $p
        break
    } catch {
        if ($candidate) { $candidate.Close() }
    }
}

if (-not $listener) {
    Write-Error "Could not bind to any tested port ($($ports -join ', '))."
    exit 1
}

Write-Host "GM University Attendance System is running at http://localhost:$boundPort/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $urlPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) { 
            $urlPath = 'index.html' 
        }

        $filePath = Join-Path $folder $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = 'text/plain'
            switch ($ext) {
                '.html' { $contentType = 'text/html; charset=utf-8' }
                '.css'  { $contentType = 'text/css; charset=utf-8' }
                '.js'   { $contentType = 'application/javascript; charset=utf-8' }
                '.png'  { $contentType = 'image/png' }
                '.jpg'  { $contentType = 'image/jpeg' }
                '.jpeg' { $contentType = 'image/jpeg' }
                '.svg'  { $contentType = 'image/svg+xml' }
                '.ico'  { $contentType = 'image/x-icon' }
                '.csv'  { $contentType = 'text/csv; charset=utf-8' }
                '.json' { $contentType = 'application/json; charset=utf-8' }
            }
            $res.ContentType = $contentType
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($err, 0, $err.Length)
        }
        $res.Close()
    } catch {
        # Continue on connection reset or abort
    }
}
