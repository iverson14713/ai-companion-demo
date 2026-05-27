# 將 ai-companion-demo 推送到新的 GitHub repo（勿推到 couple-rpg-app / health-check-in-web-app）
# 使用前請先：gh auth login

$ErrorActionPreference = "Stop"
$RepoName = "ai-companion-demo"

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Error "請先安裝 GitHub CLI: winget install GitHub.cli"
}

& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "請先登入 GitHub： gh auth login" -ForegroundColor Yellow
  & $gh auth login -h github.com -p https -w
}

Set-Location (Split-Path $PSScriptRoot -Parent)

$remotes = git remote
if ($remotes -match "origin") {
  $url = (git remote get-url origin)
  if ($url -match "couple-rpg|health-check-in-web-app|lovequest") {
    Write-Host "偵測到舊專案 remote，正在移除： $url" -ForegroundColor Yellow
    git remote remove origin
  }
}

$exists = & $gh repo view "iverson14713/$RepoName" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "建立新 repo: $RepoName ..." -ForegroundColor Cyan
  & $gh repo create $RepoName --public `
    --description "AI companion app demo - React/Vite mobile UI" `
    --source . --remote origin --push
} else {
  if (-not ($remotes -match "origin")) {
    git remote add origin "https://github.com/iverson14713/$RepoName.git"
  }
  git push -u origin main
}

Write-Host "完成。Repo: https://github.com/iverson14713/$RepoName" -ForegroundColor Green
