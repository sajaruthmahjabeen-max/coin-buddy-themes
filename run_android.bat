@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Cleaning project and starting Coin Buddy on Android...
cd android
call gradlew clean
cd ..
echo Building web assets...
call npm run build
echo Syncing Capacitor...
call npx cap sync
echo Running Coin Buddy on Android...
npx cap run android --target Pixel_3
pause
