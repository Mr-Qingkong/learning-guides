@echo off
setlocal
cd /d "%~dp0"

echo [1/5] Making sure ssh-agent is running...
sc query ssh-agent | findstr /C:"RUNNING" >nul 2>&1
if errorlevel 1 net start ssh-agent >nul 2>&1
sc query ssh-agent | findstr /C:"RUNNING" >nul 2>&1
if errorlevel 1 echo   [!] ssh-agent not running yet - continuing anyway.

echo [2/5] Loading your SSH key into the agent...
ssh-add -l >nul 2>&1
if errorlevel 1 ssh-add "%USERPROFILE%\.ssh\id_rsa"
echo   done.

echo [3/5] Configuring remote - SSH...
git remote remove origin 2>nul
git remote add origin git@github.com:Mr-Qingkong/learning-guides.git

echo [4/5] Committing local changes...
git add -A
git commit -m "update %DATE%" >nul 2>&1

echo [5/5] Pushing to GitHub...
git push -u origin main
if errorlevel 1 goto :push_fail

echo.
echo === Push OK - https://github.com/Mr-Qingkong/learning-guides ===
echo.
pause
exit /b 0

:push_fail
echo.
echo   [X] Push failed. Common causes:
echo   - "Repository not found": create an EMPTY repo named "learning-guides"
echo     at https://github.com/new without a README, then retry.
echo   - Passphrase unknown or refused: use push-https.bat instead,
echo     it needs no SSH key at all.
echo.
pause
exit /b 1
