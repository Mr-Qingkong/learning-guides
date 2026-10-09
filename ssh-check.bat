@echo off
setlocal
cd /d "%~dp0"

echo Testing SSH connection to GitHub - verbose mode...
echo.
ssh -v -o BatchMode=yes -o ConnectTimeout=20 -T git@github.com > ssh-check-log.txt 2>&1

echo ---------------- last 15 lines of ssh-check-log.txt ----------------
powershell -NoProfile -Command "Get-Content 'ssh-check-log.txt' -Tail 15"
echo -----------------------------------------------------------------------
echo.
echo Full log saved to: ssh-check-log.txt
echo.
pause
