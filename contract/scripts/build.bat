@echo off
REM Build and test Sui Move contracts for Windows

echo Building Global BUSAN Sui Move contracts...

REM Navigate to contract directory
cd /d "%~dp0\.."

REM Build the Move package
echo Running sui move build...
sui move build

if %ERRORLEVEL% neq 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)

REM Run Move tests
echo Running sui move test...
sui move test

if %ERRORLEVEL% neq 0 (
    echo Tests failed!
    exit /b %ERRORLEVEL%
)

echo Build and test completed successfully!
echo.
echo To publish to testnet, run:
echo   sui client publish --gas-budget 100000000
echo.
echo To publish to mainnet, run:
echo   sui client publish --gas-budget 100000000
