param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$PatchZip,

    [Parameter(Position = 1)]
    [string]$ProjectDir = $PSScriptRoot,

    [switch]$RunChecks
)

$ErrorActionPreference = "Stop"

function Resolve-FullPath {
    param([string]$Path)

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return [System.IO.Path]::GetFullPath($Path)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
}

$PatchZip = Resolve-FullPath $PatchZip
$ProjectDir = Resolve-FullPath $ProjectDir

if (-not (Test-Path -LiteralPath $PatchZip -PathType Leaf)) {
    throw "Patch ZIP not found: $PatchZip"
}

if ([System.IO.Path]::GetExtension($PatchZip) -ne ".zip") {
    throw "Patch file must be a .zip file: $PatchZip"
}

if (-not (Test-Path -LiteralPath $ProjectDir -PathType Container)) {
    throw "Project directory not found: $ProjectDir"
}

$packageJson = Join-Path $ProjectDir "package.json"
if (-not (Test-Path -LiteralPath $packageJson -PathType Leaf)) {
    throw "package.json was not found in the project directory: $ProjectDir"
}

$tempDir = Join-Path $env:TEMP ("english-shift-patch-" + [guid]::NewGuid().ToString("N"))

Write-Host ""
Write-Host "English Shift Patch Installer" -ForegroundColor Cyan
Write-Host "Patch   : $PatchZip"
Write-Host "Project : $ProjectDir"
Write-Host ""

try {
    New-Item -ItemType Directory -Path $tempDir | Out-Null

    Write-Host "[1/3] Extracting patch..." -ForegroundColor Yellow
    Expand-Archive -LiteralPath $PatchZip -DestinationPath $tempDir -Force

    $rootItems = @(Get-ChildItem -LiteralPath $tempDir -Force)

    if ($rootItems.Count -eq 0) {
        throw "The patch ZIP is empty."
    }

    $sourceRoot = $tempDir
    $rootFiles = @($rootItems | Where-Object { -not $_.PSIsContainer })
    $rootDirs  = @($rootItems | Where-Object { $_.PSIsContainer })

    if ($rootFiles.Count -eq 0 -and $rootDirs.Count -eq 1) {
        $sourceRoot = $rootDirs[0].FullName
        Write-Host "Detected wrapper directory: $($rootDirs[0].Name)" -ForegroundColor DarkGray
    }

    Write-Host "[2/3] Applying patch..." -ForegroundColor Yellow

    Get-ChildItem -LiteralPath $sourceRoot -Force | ForEach-Object {
        Copy-Item `
            -LiteralPath $_.FullName `
            -Destination $ProjectDir `
            -Recurse `
            -Force
    }

    Write-Host "[3/3] Patch applied successfully." -ForegroundColor Green

    if ($RunChecks) {
        Write-Host ""
        Write-Host "Running project checks..." -ForegroundColor Yellow

        Push-Location $ProjectDir
        try {
            $package = Get-Content -LiteralPath $packageJson -Raw | ConvertFrom-Json
            $hasCoreCheck = $null -ne $package.scripts -and $null -ne $package.scripts.'core:check'

            if ($hasCoreCheck) {
                npm run core:check

                if ($LASTEXITCODE -ne 0) {
                    throw "npm run core:check failed with exit code $LASTEXITCODE."
                }

                Write-Host "core:check passed." -ForegroundColor Green
            }
            else {
                Write-Host "No core:check script found in package.json. Skipping." -ForegroundColor DarkYellow
            }
        }
        finally {
            Pop-Location
        }
    }

    Write-Host ""
    Write-Host "Done." -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the mobile-accessible dev server:" -ForegroundColor Cyan
    Write-Host "  npx vite --host 0.0.0.0"
}
finally {
    if (Test-Path -LiteralPath $tempDir) {
        Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
