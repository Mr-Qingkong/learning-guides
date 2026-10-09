@echo off
setlocal
cd /d "%~dp0"

echo [1/5] Making sure ssh-agent is running...
sc query ssh-agent | findstr /C:"RUNNING" >nul 2>&1
if errorlevel 1 net start ssh-agent >nul 2>&1
sc query ssh-agent | findstr /C:"RUNNING" >nul 2>&1
if errorlevel 1 echo   [!] ssh-agent not running yet - continuing anyway.

echo [2/5] Loading SSH keys into the agent...
if exist "%USERPROFILE%\.ssh\id_ed25519" ssh-add "%USERPROFILE%\.ssh\id_ed25519" >nul 2>&1
ssh-add -l >nul 2>&1
if errorlevel 1 if exist "%USERPROFILE%\.ssh\id_rsa" ssh-add "%USERPROFILE%\.ssh\id_rsa"
echo   done.

echo [3/5] Configuring remote - SSH...
git remote remove origin 2>nul
git remote add origin git@github.com:Mr-Qingkong/learning-guides.git

echo [4/5] Committing local changes...
git add -A
git commit -m "update %DATE%" >nul 2>&1

echo [5/5] Pushing to GitHub...
set "GIT_SSH_COMMAND=ssh -o BatchMode=yes"
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
echo   - New key not on GitHub yet: run setup-new-key.bat first, add the key
echo     at https://github.com/settings/keys - Key type: Authentication Key.
echo   - "Repository not found": create an EMPTY repo named "learning-guides"
echo     at https://github.com/new without a README, then retry.
echo   - Do not want SSH at all: use push-https.bat instead.
echo.
pause
exit /b 1
