@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo ================================================
echo   Push to GitHub via SSH over port 443
echo   (bypasses blocked port 22 and flaky HTTPS)
echo ================================================
echo.

echo [1/4] Testing SSH to git@ssh.github.com:443 ...
powershell -NoProfile -Command "try { $c=New-Object System.Net.Sockets.TcpClient; $c.Connect('ssh.github.com',443); if($c.Connected){$c.Close(); exit 0} } catch { exit 1 }" >nul 2>&1
if errorlevel 1 goto :noconn

echo [2/4] Configuring SSH host alias for github.com ...
if not exist "%USERPROFILE%\.ssh" mkdir "%USERPROFILE%\.ssh"
findstr /C:"Host github.com" "%USERPROFILE%\.ssh\config" >nul 2>&1
if errorlevel 1 (
  echo.>> "%USERPROFILE%\.ssh\config"
  echo Host github.com>> "%USERPROFILE%\.ssh\config"
  echo   HostName ssh.github.com>> "%USERPROFILE%\.ssh\config"
  echo   Port 443>> "%USERPROFILE%\.ssh\config"
  echo   User git>> "%USERPROFILE%\.ssh\config"
  echo   IdentityFile ~/.ssh/id_rsa>> "%USERPROFILE%\.ssh\config"
  echo   Added ~/.ssh/config entry.
) else (
  echo   ~/.ssh/config already has a github.com entry - leaving it alone.
)

echo [3/4] Switching remote to SSH ...
git remote remove origin >nul 2>&1
git remote add origin git@github.com:Mr-Qingkong/learning-guides.git

echo [4/4] Pushing ...
echo.
git push -u origin main
if errorlevel 1 goto :fail

echo.
echo === Push OK - https://github.com/Mr-Qingkong/learning-guides ===
echo.
pause
exit /b 0

:noconn
echo   [X] ssh.github.com:443 is also unreachable.
echo   Your network is blocking GitHub entirely. Turn on a VPN/proxy first,
echo   then rerun push-https.bat. Local commit is safe.
echo.
pause
exit /b 1

:fail
echo.
echo   [X] Push failed.
echo   - If it asks to confirm the host fingerprint, type: yes
echo   - If it says "Permission denied (publickey)", your id_rsa public key
echo     must be added to https://github.com/settings/keys
echo   - Otherwise your network is still blocking it - use a VPN/proxy.
echo.
pause
exit /b 1
