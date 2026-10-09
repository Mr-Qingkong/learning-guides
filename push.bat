@echo off
setlocal
cd /d "%~dp0"

echo [1/4] Configuring remote - SSH...
git remote remove origin 2>nul
git remote add origin git@github.com:Mr-Qingkong/learning-guides.git

echo [2/4] Testing SSH authentication...
ssh -o BatchMode=yes -o ConnectTimeout=15 -T git@github.com > "%TEMP%\gh_ssh_check.txt" 2>&1
findstr /C:"successfully authenticated" "%TEMP%\gh_ssh_check.txt" >nul 2>&1
if errorlevel 1 goto :ssh_fail
echo   OK - authenticated.
del "%TEMP%\gh_ssh_check.txt" >nul 2>&1

echo [3/4] Committing local changes...
git add -A
git commit -m "update %DATE%" >nul 2>&1

echo [4/4] Pushing to GitHub...
git push -u origin main
if errorlevel 1 goto :push_fail

echo.
echo === Push OK - https://github.com/Mr-Qingkong/learning-guides ===
echo.
pause
exit /b 0

:ssh_fail
echo.
echo   [X] SSH authentication FAILED.
echo   The public key is not linked to your GitHub account yet.
echo.
echo   One-time fix:
echo     1. Open ssh-public-key.txt in this folder and copy ALL of its content.
echo     2. Open https://github.com/settings/keys and log in as Mr-Qingkong.
echo     3. Click "New SSH key", paste the key, then click "Add SSH key".
echo     4. Run this script again.
echo.
echo   Or double-click push-https.bat to push over HTTPS instead.
echo.
pause
exit /b 1

:push_fail
echo.
echo   [X] Push failed. If the message says "Repository not found",
echo   create an EMPTY repo named "learning-guides" at https://github.com/new
echo   without initializing a README, then run this script again.
echo.
pause
exit /b 1
