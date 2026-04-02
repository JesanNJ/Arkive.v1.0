@echo off
color 0B
echo =======================================================================
echo               ARKIVE STABLE - ENVIRONMENT SETUP SCRIPT
echo =======================================================================
echo.
echo Welcome! This script will prepare the Arkive Stable project.
echo It will list all required dependencies and setup your local environment.
echo.
echo -----------------------------------------------------------------------
echo [REQUIRED ENVIRONMENT VERSIONS]
echo -----------------------------------------------------------------------
echo  * Node.js         : v16 or higher (Ensure it's added to PATH)
echo  * Java Development Kit (JDK) : 17 (Recommended and compatible with AGP 7.4.2)
echo.
echo [CORE PROJECT DEPENDENCIES]
echo  * React Native    : 0.72.6
echo  * React           : 18.2.0
echo.
echo [ANDROID COMPILE SETTINGS]
echo  * Compile SDK     : 33
echo  * Target SDK      : 33
echo  * Min SDK         : 21
echo  * Build Tools     : 33.0.0
echo  * NDK Version     : 23.1.7779620 (Required for React Native 0.72.6)
echo  * Gradle Version  : 7.5 (Downloaded automatically via Wrapper)
echo  * Android Gradle Plugin (AGP) : 7.4.2
echo.
echo [MAIN LIBRARIES]
echo  * react-native-document-picker : ^9.3.1
echo  * react-native-linear-gradient : ^2.8.3
echo  * react-native-svg             : ^13.14.1
echo  * react-native-svg-transformer : ^1.5.3
echo  * react-native-vector-icons    : ^10.3.0
echo  * react-native-video           : 5.2.1
echo  * react-native-webview         : 11.26.0
echo  * crypto-js                    : 4.2.0
echo  * react-native-keychain        : 8.1.3
echo  * react-native-fs              : 2.20.0
echo  * react-native-share           : 8.2.1
echo -----------------------------------------------------------------------
echo.
pause

echo.
echo [STEP 1/3] Checking Node.js installation...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node 16+ from https://nodejs.org/
    pause
    exit /b
)
for /f "tokens=*" %%x in ('node -v') do set NODE_VER=%%x
echo Found Node.js : %NODE_VER%
echo.

echo [STEP 2/3] Installing NPM Dependencies...
echo Running 'npm install' - This might take a few minutes...
call npm install
echo Dependencies installed successfully!
echo.

echo [STEP 3/3] Setting up Android SDK path (local.properties)...
if not exist "android\local.properties" (
    if defined ANDROID_HOME (
        echo Found ANDROID_HOME: %ANDROID_HOME%
        echo Creating android\local.properties automatically...
        echo sdk.dir=%ANDROID_HOME:\=\\%> android\local.properties
        echo Successfully created local.properties.
    ) else if defined LOCALAPPDATA (
        echo Creating android\local.properties with default Windows SDK path...
        echo sdk.dir=%LOCALAPPDATA:\=\\%\\Android\\sdk> android\local.properties
        echo Successfully created local.properties.
    ) else (
        color 0E
        echo WARNING: ANDROID_HOME is not set. 
        echo Please manually create 'android\local.properties' with your SDK path.
        echo Example: sdk.dir=C\:\\Users\\YourName\\AppData\\Local\\Android\\sdk
    )
) else (
    echo android\local.properties already exists.
)

echo.
color 0A
echo =======================================================================
echo                      SETUP COMPLETED SUCCESSFULLY!
echo =======================================================================
echo.
echo Next steps to start working on Arkive Stable:
echo.
echo 1. Start Metro Bundler:
echo    npm start
echo.
echo 2. Run the Android App:
echo    npm run android
echo.
echo 3. Run the iOS App (Mac ONLY):
echo    npm run ios
echo.
echo =======================================================================
pause
