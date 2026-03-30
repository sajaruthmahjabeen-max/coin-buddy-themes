@echo off
echo Building Coin Buddy for iOS...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo Syncing with Capacitor iOS...
call npx cap sync ios
if %errorlevel% neq 0 (
    echo Sync failed!
    pause
    exit /b %errorlevel%
)
echo.
echo ======================================================
echo iOS project is ready! 
echo To run this on a Mac, clone this repo and run:
echo npx cap open ios
echo ======================================================
pause
