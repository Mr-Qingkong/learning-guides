@echo off
setlocal
cd /d "%~dp0"

echo [1/3] Configuring remote - HTTPS...
git remote remove origin 2>nul
git remote add origin https://github.com/Mr-Qingkong/learning-guides.git

echo [2/3] Committing local changes...
git add -A
git commit -m "update %DATE%" >nul 2>&1

echo [3/3] Pushing to GitHub...
echo   If a browser window pops up asking to sign in to GitHub, complete the login there.
git push -u origin main
if errorlevel 1 goto :push_fail

echo.
echo === Push OK - https://github.com/Mr-Qingkong/learning-guides ===
echo.
pause
exit /b 0

:push_fail
echo.
echo   [X] Push failed. Check the error message above.
echo   If it says "Repository not found", create an EMPTY repo named
echo   "learning-guides" at https://github.com/new first, then retry.
echo.
pause
exit /b 1
