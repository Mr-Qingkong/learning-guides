@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo ================================================
echo   Push to GitHub - https://github.com/Mr-Qingkong/learning-guides
echo ================================================
echo.

echo [1/6] Testing network to github.com:443 ...
powershell -NoProfile -Command "try { $c=New-Object System.Net.Sockets.TcpClient; $c.Connect('github.com',443); if($c.Connected){$c.Close(); exit 0} } catch { exit 1 }" >nul 2>&1
if errorlevel 1 goto :no_direct

echo   Direct connection OK.
set GITPROXY=
goto :do_commit

:no_direct
echo   [X] Cannot reach github.com:443 directly (network blocked).
echo.
echo   Checking common local proxy ports ...
set FOUND=
for %%P in (7890 7897 10809 10808 1080 2080 8080 7891 20171 33210) do (
  powershell -NoProfile -Command "try { $c=New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1',%%P); if($c.Connected){$c.Close(); exit 0} } catch { exit 1 }" >nul 2>&1
  if not errorlevel 1 (
    set FOUND=%%P
    echo   Found proxy on port %%P
    goto :set_proxy
  )
)
goto :no_proxy

:set_proxy
set GITPROXY=http://127.0.0.1:!FOUND!
echo   Using proxy !GITPROXY!
goto :do_commit

:no_proxy
echo.
echo   [X] No direct connection and no local proxy found.
echo.
echo   How to fix - pick ONE:
echo     1) Turn on your VPN / proxy software (Clash, V2Ray, etc.), then rerun this file.
echo     2) Set git proxy manually, then rerun:
echo          git config --global http.proxy http://127.0.0.1:YOUR_PORT
echo          git config --global https.proxy http://127.0.0.1:YOUR_PORT
echo     3) Use SSH over port 443 (see push-ssh443.bat in this folder).
echo.
echo   Your local commit is safe. Nothing is lost.
echo.
pause
exit /b 1

:do_commit
echo.
echo [2/6] Cleaning up any global proxy leftovers for this repo ...
git config --local --unset http.proxy >nul 2>&1
git config --local --unset https.proxy >nul 2>&1
if not "%GITPROXY%"=="" (
  git config --local http.proxy %GITPROXY%
  git config --local https.proxy %GITPROXY%
)

echo [3/6] Configuring remote - HTTPS...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Mr-Qingkong/learning-guides.git

echo [4/6] Committing local changes...
git add -A
git commit -m "update %DATE%" >nul 2>&1

echo [5/6] Fetching remote to check for divergence...
git fetch origin
if errorlevel 1 (
  echo   [WARN] fetch failed ^(network^). Will try pushing anyway.
  goto :do_push
)

if not exist ".git\refs\remotes\origin\main" goto :do_push

git rev-list --count HEAD..origin/main > "%TEMP%\_behind.txt" 2>nul
set /p BEHIND=<"%TEMP%\_behind.txt"
del "%TEMP%\_behind.txt" >nul 2>&1
if not defined BEHIND goto :do_push
if "%BEHIND%"=="0" goto :do_push

echo   Remote is ahead by %BEHIND% commit^(s^). Merging remote changes first...
git merge --no-edit --allow-unrelated-histories origin/main
if errorlevel 1 (
  echo   [X] Merge conflict. Resolve it manually in this folder, then rerun.
  echo       Files in conflict are listed above. Nothing has been pushed.
  pause
  exit /b 1
)

:do_push
echo [6/6] Pushing to GitHub ...
echo   If a browser window pops up asking to sign in to GitHub, complete the login there.
echo.
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
echo.
echo   - "Repository not found"  -^> create an EMPTY repo "learning-guides"
echo                               at https://github.com/new, then retry.
echo   - "rejected ... fetch first" -^> remote has new commits. Rerun this file;
echo                                  it now auto-merges them before pushing.
echo   - "SSL_read ... errno 10053" / "getaddrinfo thread failed" / "Connection was aborted"
echo                              -^> network was cut mid-transfer. Just rerun later.
echo                                 If it keeps failing, use push-ssh443.bat.
echo.
pause
exit /b 1

