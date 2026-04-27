$ErrorActionPreference = 'Stop'

$base = 'http://localhost:8080'
$h = @{ 'Content-Type' = 'application/json' }
$email = 'senior.demo@sahara.app'
$pass = 'Sahara@1234'

$token = $null
$uid = 'senior_123'
$loginStatus = 0
$authH = @{ 'Content-Type' = 'application/json' }

$loginBody = @{ email = $email; password = $pass } | ConvertTo-Json
$login = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -Headers $h -Body $loginBody -UseBasicParsing -SkipHttpErrorCheck
$loginStatus = $login.StatusCode

if ($login.StatusCode -eq 200) {
  $auth = $login.Content | ConvertFrom-Json
  $token = $auth.access_token
  $uid = $auth.user.id
  $authH = @{ 'Content-Type' = 'application/json'; Authorization = "Bearer $token" }
}
else {
  # Fallback local demo login path
  $demoBody = @{ email = 'senior@sahara.com'; password = 'sahara123' } | ConvertTo-Json
  $demoLogin = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -Headers $h -Body $demoBody -UseBasicParsing -SkipHttpErrorCheck
  if ($demoLogin.StatusCode -eq 200) {
    $demo = $demoLogin.Content | ConvertFrom-Json
    $token = $demo.access_token
    $uid = $demo.user.id
    $authH = @{ 'Content-Type' = 'application/json'; Authorization = "Bearer $token" }
  }
}

$autoH = Invoke-WebRequest -Uri "$base/api/health/auto-log/$uid" -Method POST -Headers $authH -UseBasicParsing -SkipHttpErrorCheck

$manualHBody = @{
  user_id = $uid
  bp_sys = 133
  bp_dia = 84
  sugar = 119
  heart_rate = 76
  haemoglobin = 11.8
  fatigue = 3
} | ConvertTo-Json
$manualH = Invoke-WebRequest -Uri "$base/api/health/log" -Method POST -Headers $authH -Body $manualHBody -UseBasicParsing -SkipHttpErrorCheck

$autoN = Invoke-WebRequest -Uri "$base/api/nutrition/auto-log/$uid?meal_type=breakfast" -Method POST -Headers $authH -UseBasicParsing -SkipHttpErrorCheck

$manualNBody = @{
  user_id = $uid
  meal_type = 'lunch'
  food_name = 'Dal Chawal'
  kcal = 450
  protein = 14
  iron_mg = 4
} | ConvertTo-Json
$manualN = Invoke-WebRequest -Uri "$base/api/nutrition/log" -Method POST -Headers $authH -Body $manualNBody -UseBasicParsing -SkipHttpErrorCheck

$today = Invoke-WebRequest -Uri "$base/api/nutrition/today/$uid" -Method GET -Headers $authH -UseBasicParsing -SkipHttpErrorCheck
$todayJson = $today.Content | ConvertFrom-Json

$chatBody = @{
  user_id = $uid
  user_email = $email
  message = 'Summarize my latest vitals and meal logs'
  language = 'en'
} | ConvertTo-Json
$chat = Invoke-WebRequest -Uri "$base/api/ai/chat" -Method POST -Headers $authH -Body $chatBody -UseBasicParsing -SkipHttpErrorCheck
$chatJson = $chat.Content | ConvertFrom-Json

Write-Output "LOGIN_STATUS=$loginStatus"
Write-Output "USER_ID=$uid"
Write-Output "AUTO_HEALTH_STATUS=$($autoH.StatusCode)"
Write-Output "MANUAL_HEALTH_STATUS=$($manualH.StatusCode)"
Write-Output "AUTO_NUTRITION_STATUS=$($autoN.StatusCode)"
Write-Output "MANUAL_NUTRITION_STATUS=$($manualN.StatusCode)"
Write-Output "TODAY_STATUS=$($today.StatusCode)"
Write-Output "TODAY_KCAL=$($todayJson.summary.kcal)"
Write-Output "TODAY_PROTEIN=$($todayJson.summary.protein)"
Write-Output "MEAL_LABELS=$((($todayJson.meal_status | ForEach-Object { $_.meal_type + ':' + $_.logged + ':' + $_.missed }) -join ';'))"
Write-Output "AI_CHAT_STATUS=$($chat.StatusCode)"
Write-Output "AI_SOURCE=$($chatJson.source)"
