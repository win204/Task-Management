$headers = @{
    "Content-Type" = "application/json"
}
$body = '{"username":"admin","password":"123123"}'

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Headers $headers -Body $body
$token = $loginResponse.data.token

Write-Output "Token: $token"

if ($token) {
    $authHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }
    
    Write-Output "--- Fetching Activity Logs ---"
    try {
        $logs = Invoke-RestMethod -Uri "http://localhost:8080/api/activity-logs/search?page=0&size=10" -Method Get -Headers $authHeaders
        $logs | ConvertTo-Json -Depth 5
    } catch {
        Write-Output "Error fetching Activity Logs: $_"
    }

    Write-Output "--- Fetching Notifications ---"
    try {
        $notifs = Invoke-RestMethod -Uri "http://localhost:8080/api/notifications/unread?userId=1" -Method Get -Headers $authHeaders
        $notifs | ConvertTo-Json -Depth 5
    } catch {
        Write-Output "Error fetching Notifications: $_"
    }
}
