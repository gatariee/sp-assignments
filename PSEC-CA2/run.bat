@echo off
call env\Scripts\Activate.bat
start cmd /c "python server.py"
timeout /t 1
python main.py
exit