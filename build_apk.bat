@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/4] Building web assets...
call npm run build

echo [2/4] Syncing Capacitor...
call npx cap sync

echo [3/4] Building Android APK...
cd android
call gradlew assembleDebug
cd ..

echo [4/4] Copying APK to root...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy "android\app\build\outputs\apk\debug\app-debug.apk" "coin-buddy-debug.apk"
    echo.
    echo SUCCESS: Your APK is ready!
    echo File: coin-buddy-debug.apk
) else (
    echo.
    echo ERROR: APK build failed. Check the logs above.
)

pause
