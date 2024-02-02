@echo off
echo Checking Python Version...
for /f "tokens=2 delims='.'" %%i in ('python -V^|findstr /R [0-9].[0-9]') do (
    set version=%%i
)
if %version% GEQ 9 (
    echo Python version is above 3.9: OK
) else (
    echo Python version is not above 3.9: There may be problems...
    pause
    exit /b 1
)

echo Starting Virtual Environment...
if not exist env (
    python -m venv env
)
call env\Scripts\Activate.bat

echo Installing Python Dependencies...
if exist requirements.txt (
    pip install -r requirements.txt
)

echo Testing Installation
python debug.py