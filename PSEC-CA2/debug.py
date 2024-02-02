import sys
import os
def main():
    python_ver = 0
    print("Checking for Python version...")
    if sys.version_info[0] < 3 or sys.version_info[1] < 9:
        print("Python version is too old. Python 3.9+ is required.")
    else:
        print("Python version is OK.")
        python_ver = 1
    print("Checking entire directory...")
    directory_contents = os.listdir()
    expected_files = ['ftpClientData', 'ftpServerData', 'results', 'client.py', 
                      'custom_packet.py', 'debug.py', 'main.py', 'portscanner.py',
                      'requirements.txt', 'server.py']
    missing_files = []
    dir_check = 0
    for file in expected_files:
        print(f"Checking for {file}...")
        if file not in directory_contents:
            missing_files.append(file)
        else:
            print(f"{file}: OK")
    if missing_files:
        print(f"Missing files: {missing_files}")
    else:
        print("All expected files are present.")
        dir_check = 1
    print("Checking virtual environment...")
    virtual_env = 0
    if os.path.basename(sys.executable) == 'python':
        print("Virtual environment is not activated.")
    else:
        print("Virtual environment is activated.")
        virtual_env = 1
    print("Checking for required modules...")
    req = 0
    required_modules = [
        "colorama==0.4.6",
        "ping3==4.0.4",
        "python-nmap==0.7.1",
        "regex==2022.10.31",
        "scapy==2.5.0",
        "termcolor==2.2.0",
        "terminaltables==3.1.10",
        "pyftpdlib==1.5.7",
        ]
    missing_modules = []
    for module in required_modules:
        try:
            if(module == "python-nmap==0.7.1"):
                __import__("nmap")
            else:
                __import__(module.split("==")[0])
            print(f"{module}: OK")
        except ImportError:
            print(f"{module}: Missing")
            missing_modules.append(module)

    if missing_modules:
        print(f"The following modules are missing: {', '.join(missing_modules)}")
    else:
        req = 1

    if python_ver and dir_check and virtual_env and req:
        print("All checks passed. Installation is OK.\nFollow the instructions on the README.md file to run the program.")
    else:
        print("One ore more checks failed. Installation is not OK.")
if __name__ == '__main__':
    main()
