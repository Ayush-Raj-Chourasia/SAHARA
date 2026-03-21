$base = 'https://sahara-backend-api-production.up.railway.app'
$headers = @{
  'Content-Type' = 'application/json'
  Origin = 'https://sahara-flax.vercel.app'
}

function Register-Or-Login {
  param(
    [string]$email,
    [string]$password,
    [string]$name,
    [string]$role,
    [string]$phone
  )

  $regBody = @{
    name = $name
    email = $email
    password = $password
    phone = $phone
    role = $role
    conditions = @()
  } | ConvertTo-Json -Depth 5

  $reg = Invoke-WebRequest -Uri "$base/api/auth/register" -Method POST -Headers $headers -Body $regBody -UseBasicParsing -SkipHttpErrorCheck
  if ($reg.StatusCode -eq 200) {
    $j = $reg.Content | ConvertFrom-Json
    return @{ token = $j.access_token; user = $j.user; source = 'registered' }
  }

  $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
  $login = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -Headers $headers -Body $loginBody -UseBasicParsing -SkipHttpErrorCheck
  if ($login.StatusCode -eq 200) {
    $j = $login.Content | ConvertFrom-Json
    return @{ token = $j.access_token; user = $j.user; source = 'logged_in_existing' }
  }

  throw "Unable to register/login $email. Register=$($reg.StatusCode) Login=$($login.StatusCode)"
}

$seniorEmail = 'senior.demo@sahara.app'
$familyEmail = 'family.demo@sahara.app'
$demoPassword = 'Sahara@1234'

$senior = Register-Or-Login -email $seniorEmail -password $demoPassword -name 'Ratan Demo' -role 'senior' -phone '+919876543210'
$seniorHeaders = @{
  Authorization = "Bearer $($senior.token)"
  'Content-Type' = 'application/json'
  Origin = 'https://sahara-flax.vercel.app'
}

$seniorProfile = @{
  name = 'Ratan Demo'
  phone = '+919876543210'
  age = 69
  gender = 'Male'
  weight_kg = 67
  conditions = @('hypertension')
  location = 'Bhubaneswar'
  language_preference = 'Hindi'
  living_status = 'with_family'
  family_proximity = 'same_city'
} | ConvertTo-Json -Depth 5

$cp1 = Invoke-WebRequest -Uri "$base/api/auth/complete-profile" -Method POST -Headers $seniorHeaders -Body $seniorProfile -UseBasicParsing -SkipHttpErrorCheck
$invite = Invoke-WebRequest -Uri "$base/api/auth/my-invite" -Method GET -Headers @{ Authorization = "Bearer $($senior.token)"; Origin = 'https://sahara-flax.vercel.app' } -UseBasicParsing -SkipHttpErrorCheck
$inviteCode = ($invite.Content | ConvertFrom-Json).invite_code

$logs = @(
  @{ bp_sys = 132; bp_dia = 84; sugar = 116; heart_rate = 74; weight = 67; fatigue = 3 },
  @{ bp_sys = 138; bp_dia = 86; sugar = 124; heart_rate = 78; weight = 67; fatigue = 4 },
  @{ bp_sys = 129; bp_dia = 82; sugar = 111; heart_rate = 72; weight = 66.8; fatigue = 2 }
)
foreach ($l in $logs) {
  $payload = @{
    user_id = $senior.user.id
    bp_sys = $l.bp_sys
    bp_dia = $l.bp_dia
    sugar = $l.sugar
    heart_rate = $l.heart_rate
    weight = $l.weight
    fatigue = $l.fatigue
  } | ConvertTo-Json
  Invoke-WebRequest -Uri "$base/api/health/log" -Method POST -Headers $headers -Body $payload -UseBasicParsing -SkipHttpErrorCheck | Out-Null
}

$family = Register-Or-Login -email $familyEmail -password $demoPassword -name 'Ayush Demo' -role 'family' -phone '+919999000111'
$familyHeaders = @{
  Authorization = "Bearer $($family.token)"
  'Content-Type' = 'application/json'
  Origin = 'https://sahara-flax.vercel.app'
}

$familyProfile = @{
  name = 'Ayush Demo'
  phone = '+919999000111'
  relationship = 'son'
  location = 'Bhubaneswar'
  proximity = 'same_city'
  invite_code = $inviteCode
} | ConvertTo-Json -Depth 5

$cp2 = Invoke-WebRequest -Uri "$base/api/auth/complete-profile" -Method POST -Headers $familyHeaders -Body $familyProfile -UseBasicParsing -SkipHttpErrorCheck
$hist = Invoke-WebRequest -Uri "$base/api/health/history/$($senior.user.id)" -Method GET -UseBasicParsing -SkipHttpErrorCheck
$histCount = ($hist.Content | ConvertFrom-Json).Count

Write-Output "SENIOR_EMAIL=$seniorEmail"
Write-Output "FAMILY_EMAIL=$familyEmail"
Write-Output "PASSWORD=$demoPassword"
Write-Output "INVITE_CODE=$inviteCode"
Write-Output "SENIOR_SOURCE=$($senior.source)"
Write-Output "FAMILY_SOURCE=$($family.source)"
Write-Output "SENIOR_ONBOARD_STATUS=$($cp1.StatusCode)"
Write-Output "FAMILY_ONBOARD_STATUS=$($cp2.StatusCode)"
Write-Output "SENIOR_HISTORY_COUNT=$histCount"
