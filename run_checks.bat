@echo off
cd /d "%~dp0"
echo ====== Running npm lint ======
call npm run lint
echo.
echo ====== Running npm build ======
call npm run build
echo.
echo ====== Running npm test ======
call npm run test
