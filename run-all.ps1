# run-all.ps1 — start all four politiboop dev servers in separate PowerShell windows.
#
# Usage:
#   .\run-all.ps1                    # start all four
#   .\run-all.ps1 -Install           # npm install in each first, then start
#   .\run-all.ps1 -Only tracker      # start only the tracker
#   .\run-all.ps1 -Only tracker,civics
#   .\run-all.ps1 -Open              # also open browser tabs
#   .\run-all.ps1 -Stop              # close all dev-server windows opened by this script
#
# Ports:
#   3000 — controversial-trump/website     (the tracker, Docusaurus)
#   4321 — controversial-trump-research    (the research site, Astro)
#   4322 — the-civics-desk                 (Civics Desk, Astro)
#   4323 — stand-against-trump             (personal essays, Astro)

[CmdletBinding()]
param(
  [ValidateSet('tracker','research','civics','personal','all')]
  [string[]]$Only = @('all'),
  [switch]$Install,
  [switch]$Open,
  [switch]$Stop
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$sites = [ordered]@{
  tracker  = @{
    Name = 'Tracker (controversial-trump)'
    Path = Join-Path $root 'controversial-trump\website'
    Port = 3000
    # Docusaurus respects --port; npm passes args after `--`.
    Cmd  = 'npm start -- --port 3000 --no-open'
  }
  research = @{
    Name = 'Research site (controversial-trump-research)'
    Path = Join-Path $root 'controversial-trump-research'
    Port = 4321
    Cmd  = 'npm run dev -- --port 4321'
  }
  civics   = @{
    Name = 'The Civics Desk (the-civics-desk)'
    Path = Join-Path $root 'the-civics-desk'
    Port = 4322
    Cmd  = 'npm run dev -- --port 4322'
  }
  personal = @{
    Name = 'Stand Against Trump (stand-against-trump)'
    Path = Join-Path $root 'stand-against-trump'
    Port = 4323
    Cmd  = 'npm run dev -- --port 4323'
  }
}

function Get-SelectedKeys {
  if ($Only -contains 'all') { return $sites.Keys }
  return $Only | Where-Object { $sites.Contains($_) }
}

function Stop-DevServers {
  # Find and close any PowerShell windows we previously launched.
  # We tag them via the window title so this only touches our own processes.
  $titles = $sites.Values | ForEach-Object { "politiboop-dev :: $($_.Name)" }
  $procs = Get-Process powershell, pwsh -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -and ($titles -contains $_.MainWindowTitle) }
  if (-not $procs) {
    Write-Host 'No politiboop dev-server windows found.' -ForegroundColor Yellow
    return
  }
  foreach ($p in $procs) {
    Write-Host "Stopping: $($p.MainWindowTitle) (PID $($p.Id))" -ForegroundColor DarkYellow
    Stop-Process -Id $p.Id -Force
  }
}

if ($Stop) { Stop-DevServers; return }

$selected = Get-SelectedKeys
if (-not $selected -or $selected.Count -eq 0) {
  Write-Error 'No valid sites selected. Use -Only tracker,research,civics,personal or omit -Only for all.'
  return
}

# Sanity check: each selected site must have a package.json.
foreach ($key in $selected) {
  $info = $sites[$key]
  $pkg = Join-Path $info.Path 'package.json'
  if (-not (Test-Path $pkg)) {
    Write-Error "Missing package.json at: $pkg"
    return
  }
}

# Optional install pass — runs sequentially in this window so output is captured.
if ($Install) {
  foreach ($key in $selected) {
    $info = $sites[$key]
    Write-Host ""
    Write-Host "==> npm install in $($info.Name)" -ForegroundColor Cyan
    Push-Location $info.Path
    try {
      npm install
      if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed in $($info.Path)"
        return
      }
    } finally {
      Pop-Location
    }
  }
}

# Launch each site in its own PowerShell window so output is per-site.
foreach ($key in $selected) {
  $info  = $sites[$key]
  $title = "politiboop-dev :: $($info.Name)"
  $url   = "http://localhost:$($info.Port)"

  Write-Host ""
  Write-Host "Starting $($info.Name)" -ForegroundColor Green
  Write-Host "  cwd:  $($info.Path)"
  Write-Host "  cmd:  $($info.Cmd)"
  Write-Host "  url:  $url"

  # Build the command for the child window:
  #   - set the window title so -Stop can find it
  #   - cd to the site directory
  #   - print the URL banner
  #   - run the dev command
  # The child window stays open after the server exits so you can read the output.
  $child = @"
`$Host.UI.RawUI.WindowTitle = '$title'
Set-Location -LiteralPath '$($info.Path)'
Write-Host ''
Write-Host '================================================================'
Write-Host '  $($info.Name)'
Write-Host '  Local: $url'
Write-Host '  Ctrl+C to stop. Close the window when done.'
Write-Host '================================================================'
Write-Host ''
$($info.Cmd)
Write-Host ''
Write-Host '(server stopped — press Enter to close)' -ForegroundColor DarkGray
[void][System.Console]::ReadLine()
"@

  $encoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($child))
  Start-Process -FilePath 'powershell' -ArgumentList @('-NoExit','-EncodedCommand', $encoded) | Out-Null
}

if ($Open) {
  Start-Sleep -Seconds 6  # give the servers a moment to bind their ports
  foreach ($key in $selected) {
    Start-Process ("http://localhost:$($sites[$key].Port)") | Out-Null
  }
}

Write-Host ""
Write-Host "All selected dev servers launched. URLs:" -ForegroundColor Green
foreach ($key in $selected) {
  $info = $sites[$key]
  Write-Host ("  http://localhost:{0,-5}  {1}" -f $info.Port, $info.Name)
}
Write-Host ""
Write-Host "Stop them with: .\run-all.ps1 -Stop" -ForegroundColor DarkGray
