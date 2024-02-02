try:
    import os
    import socket
    from termcolor import colored
    from terminaltables import SingleTable
    from portscanner import Scanner
    from client import FTPHandler
    from custom_packet import PacketHandler
except Exception as e:
    print(f"Error: {e}")
    if e == ModuleNotFoundError:
        print("Please run 'pip install -r requirements.txt' to install the required modules.")
        print("If you are using a virtual environment, make sure it is activated.")
    elif "nmap" in str(e):
        print("If python-nmap is installed, it may be colliding with another library that also uses the same nmap name")
        print("\nThis is a well-known issue that we can not fix. \nhttps://stackoverflow.com/questions/71652574/getting-error-attributeerror-module-nmap-has-no-attribute-portscanner \n")
        print("Please try the following: \n1. Start a new virtual environment \n2. Run 'pip install -r requirements.txt' \n3. Run the program again")

    else:
        print("Unknown error. Please check your installation.")
    exit()

def clear_screen(): 
    os.system('cls' if os.name == 'nt' else 'clear')
def buffer():
    input("Press enter to continue...")

def main_menu():       
    data = [
        ["1", "Port Scanner"], 
        ["2", "FTP Client"], 
        ["3", "Custom Packet"], 
        ["4", "Exit"]
    ]
    options_table: SingleTable = SingleTable(data)
    options_table.inner_row_border = 1
    print(colored(
        rf"""
    ██████╗ ███████╗███████╗ ██████╗
    ██╔══██╗██╔════╝██╔════╝██╔════╝
    ██████╔╝███████╗█████╗  ██║     
    ██╔═══╝ ╚════██║██╔══╝  ██║     
    ██║     ███████║███████╗╚██████╗
    ╚═╝     ╚══════╝╚══════╝ ╚═════╝     
    {colored("Author: ", 'red', attrs=['bold'])} {colored("Zavier Lee", 'blue', attrs=['bold'])}   
    {colored("Class: ", 'red', attrs=['bold'])} {colored("DISM/FT/1B/05", 'blue', attrs=['bold'])}   
    {colored("Module Code: ", 'red', attrs=['bold'])} {colored("ST2414", 'blue', attrs=['bold'])}
    """, 'green').center(250))
    print(options_table.table)


while 1:
    clear_screen()
    main_menu()
    choice = input(">> ")
    match choice:
        case '1':
            nmap_scan = Scanner()
            nmap_scan.run()
        case '2':
            IP = socket.gethostbyname(socket.gethostname())
            PORT = 2121
            ftp_client = FTPHandler(IP , PORT)
            ftp_client.run()
        case '3':
            packet_handler = PacketHandler()
            packet_handler.run()
        case '4':
            exit()
        case _:
            print("Invalid choice. Try again.")
            buffer()