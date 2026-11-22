# Vercel руу байршуулах скрипт.
# Vercel нь git commit-ийн зохиогчийн имэйлийг шалгаад deploy-г хаадаг тул
# төслийг git-гүй түр хавтас руу хуулж, тэндээсээ deploy хийнэ.
# Ажиллуулах: homework хавтас дотроос  .\deploy.ps1

$ErrorActionPreference = 'Stop'
$src = $PSScriptRoot
$tmp = Join-Path $env:TEMP 'portfolio-deploy'

if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory $tmp | Out-Null

Copy-Item (Join-Path $src 'src'), (Join-Path $src 'public'), (Join-Path $src '.vercel'),
          (Join-Path $src 'index.html'), (Join-Path $src 'package.json'),
          (Join-Path $src 'package-lock.json'), (Join-Path $src 'vite.config.js') -Destination $tmp -Recurse

Push-Location $tmp
try {
  npx --yes vercel@latest deploy --prod --yes
} finally {
  Pop-Location
}
