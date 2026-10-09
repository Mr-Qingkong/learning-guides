@echo off
setlocal
cd /d "%~dp0"

echo [1/4] Configuring remote...
git remote remove origin 2>nul
git remote add origin git@github.com:Mr-Qingkong/learning-guides.git

echo [2/4] Staging changes...
git add -A

echo [3/4] Committing (skipped if nothing to commit)...
git commit -m "update: %DATE% %TIME%"

echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo === Done. Press any key to close ===
pause >nul
