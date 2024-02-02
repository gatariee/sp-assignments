# PSEC CA1-2 (Security Application)

## Documentation
- Located at ./docs/guide.pdf
    - Includes comprehensive testing 
    - Includes all required screenshots 

## Requirements
- [Python 3.9+](https://www.python.org/downloads/)
- [Nmap 7.93+](https://nmap.org/download.html)
## Installation

```bash
git clone https://github.com/gatariee/PSEC-CA1-2
cd PSEC-CA1-2
```
### Windows (Manual Setup)
```bash
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```
### Linux (Manual Setup)
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```
### Automatic Setup
```bash
./setup.bat
```

## Usage
### Manual Launch
```bash
env\Scripts\activate
python server.py
python main.py
```
### Automatic Launch
```bash
./run.bat
```

## Troubleshooting
- debug.py is a script that can be used to debug the program
    - it will check the environment variables and the python version
    - it will also check if the required modules are installed
- If you are having issues with the program, run debug.py and check the output





