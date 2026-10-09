@echo off
setlocal
cd /d "%~dp0"

if exist "%USERPROFILE%\.ssh\id_ed25519" goto :add

echo Generating a NEW SSH key - ed25519, NO passphrase...
ssh-keygen -t ed25519 -C "learning-guides" -N "" -f "%USERPROFILE%\.ssh\id_ed25519"
if errorlevel 1 goto :fail

:add
echo Loading the key into ssh-agent...
ssh-add "%USERPROFILE%\.ssh\id_ed25519"

copy /y "%USERPROFILE%\.ssh\id_ed25519.pub" "ssh-public-key.txt" >nul

echo.
echo ---- Your NEW public key ----
type "%USERPROFILE%\.ssh\id_ed25519.pub"
echo ------------------------------
echo.
echo Done. Next steps:
echo   1. Open ssh-public-key.txt in this folder and copy ALL of its content.
echo   2. Open https://github.com/settings/keys and log in as Mr-Qingkong.
echo   3. Click "New SSH key" - Key type MUST be "Authentication Key".
echo   4. Paste the key and save.
echo   5. Double-click push.bat - no passphrase will ever be asked.
echo.
pause
exit /b 0

:fail
echo.
echo Key generation failed - check the message above.
echo.
pause
exit /b 1
