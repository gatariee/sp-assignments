import nmap
import regex as re
import os
import json
from datetime import datetime as dt
from colorama import Fore
from terminaltables import SingleTable
from ping3 import ping
def clear_screen(): 
    os.system('cls' if os.name == 'nt' else 'clear')
def buffer():
    input("Press enter to continue...")
class Scanner:
    """
    This class is used to scan a list of hosts using nmap.

    Args:
        targets (str): A string of hosts to scan. (e.g "localhost scanme.nmap.org")
        options (str): A string of nmap options to use. (e.g "-sU -sT --top-ports 10 -sV -sC --traceroute -O")
    """

    def __init__(self):
        self.targets = ""
        self.targets_check = False
        self.options = ""
        self.options_check = False
        self.options_dict = {
                "-sU": "OFF",
                "-sT": "OFF",
                "--top-ports 10": "OFF",
                "-sV": "OFF",
                "-sC": "OFF",
                "--traceroute": "OFF",
                "-O": "OFF",
            }
        
    def clean_results(self, initial_scan: nmap.PortScanner) -> list:
        """
        Cleans the results of the initial scan into a format that is easier to work with

        Args:
            initial_scan (nmap.PortScanner): The initial scan results.

        Returns:
            list: A list of dictionaries containing the results of the scan
        """
        results = []
        for host in initial_scan.all_hosts():
            host_dict = {
                "host": host,
                "hostname": initial_scan[host].hostname(),
                "protocol": initial_scan[host].all_protocols(),
            }
            for protocol in host_dict['protocol']:
                host_dict[protocol] = {}
                for port in initial_scan[host][protocol].keys():
                    host_dict[protocol][port] = {
                        "port": port, 
                        "state": initial_scan[host][protocol][port]['state'], 
                        "product": initial_scan[host][protocol][port]['product'], 
                        "extrainfo": initial_scan[host][protocol][port]['extrainfo'], 
                        "reason": initial_scan[host][protocol][port]['reason'], 
                        "cpe": initial_scan[host][protocol][port]['cpe']
                        }
            results.append(host_dict)
        return results

    def perform_scan(self) -> list:
        """
        This function performs the port scan

        Returns:
            list: The results of the scan after being cleaned
        """
        nm = nmap.PortScanner()
        print(f"Type of nmScan: {type(nm)}")
        print(f"Scanning hosts: {self.scan_targets}")
        print("Beginning scan...")
        initial_result = nm.scan(hosts = self.scan_targets, arguments = self.options)
        print(f"Type of results: {type(initial_result)}")
        print(f"Scanning options used: {self.options}")
        scan_results = self.clean_results(initial_scan=nm)
        return scan_results

    def generate_table(self, scan_results: list) -> None:
        """
        Generates and prints a table of the scan results

        Args:
            scan_results (list): A table containing the results of the scan
        """
        table_data = [
            ['Host', 'Hostname', 'Protocol', 'Port ID', 'State', 'Product', 'Extra Info', 'Reason', 'CPE']
        ]
        for host in scan_results:
            for protocol in host['protocol']:
                for port in host[protocol].keys():
                    table_data.append([
                        host['host'],
                        host['hostname'],
                        protocol,
                        host[protocol][port]['port'],
                        host[protocol][port]['state'],
                        host[protocol][port]['product'],
                        host[protocol][port]['extrainfo'],
                        host[protocol][port]['reason'],
                        host[protocol][port]['cpe']
                    ])
        TABLE: SingleTable = SingleTable(table_data)
        TABLE.inner_row_border = 1
        for row in TABLE.table_data:
            if row[4] == 'open':
                row[4] = Fore.GREEN + row[4] + Fore.RESET
            elif row[4] == 'closed':
                row[4] = Fore.RED + row[4] + Fore.RESET
            elif row[4] == 'filtered':
                row[4] = Fore.YELLOW + row[4] + Fore.RESET
            elif row[4] == 'open|filtered':
                row[4] = Fore.CYAN + row[4] + Fore.RESET
        print(TABLE.table)

    def is_alive(self) -> bool:
        """
        Checks if the hosts are alive.

        Returns:
            bool: If at least one host is alive, returns True. Otherwise, returns False.
        """
        alive = ""
        table_data = [
            ['Host', 'Status']
        ]
        for host in self.targets.split(' '):
            response = ping(host, timeout=1)
            if(response is not None and response is not False):
                alive = alive + host + " "
                table_data.append([host,Fore.GREEN + "Alive" + Fore.RESET])
            else:
                table_data.append([host,Fore.RED + "Dead" + Fore.RESET])
        TABLE: SingleTable = SingleTable(table_data)
        TABLE.inner_row_border = 1
        print(TABLE.table)
        if(len(alive) == 0):
            return False
        else:
            self.scan_targets = alive
            return True
    def main_menu(self) -> bool or None:
        while 1:
            clear_screen()
            self.initialize_values()
            table_data = [
                ["X", "X", "X"],
                ["1", "TARGET", self.targets],
                ["2", "OPTIONS", self.options],
                ["3", "SCAN", "Start Scan"],
                ["4", "VIEW", "View Scans"],
                ["5", "EXIT", "Exit"]
            ] 
            TABLE: SingleTable = SingleTable(table_data)
            TABLE.inner_row_border = 1
            print(TABLE.table)
            choice = input(">> ")
            if(choice == "1"):
                self.change_targets()
            elif(choice == "2"):
                self.change_options()
            elif(choice == "3"):
                if(self.safety_net()):
                    return True
                else:
                    # THIS SHOULD ONLY EVER HAPPEN IF THE TARGET/OPTIONS ARE EMPTY
                    print("One ore more of the values you entered are invalid. Please try again.")
                    buffer()
            elif(choice == "4"):
                self.view_past_scans()
            elif(choice == "5"):
                return False
            else:
                print("Invalid choice. Please try again.")
                buffer()
    def safety_net(self) -> bool:
        for host in self.targets.split(' '):
            if(
                re.match(r"^[a-zA-Z0-9\.\-]+$", host) is None
                ) or (
                re.match(r"^https?://www\.[a-zA-Z0-9]+\.[a-z]{2,}$", host) is not None
                ) or (
                re.match(r"^https?://[a-zA-Z0-9]+\.[a-z]{2,}$", host) is not None 
                ):
                return False
        return True
    def view_past_scans(self) -> None:
        clear_screen()
        scans_directory = "./results"
        if(os.path.exists(scans_directory)):
            scan_files = os.listdir(scans_directory)
            if(len(scan_files) == 0):
                print("No scan results found.")
                buffer()
            else:
                print(f"Scan results found: {len(scan_files)}")
                table_data = [
                    ["No.", "File"]
                ]
                for i in range(len(scan_files)):
                    table_data.append([i + 1, scan_files[i]])
                TABLE: SingleTable = SingleTable(table_data)
                TABLE.inner_row_border = 1
                print(TABLE.table)
                choice = input("Enter the number of the scan you want to view: ")
                if(choice.isdigit() and int(choice) <= len(scan_files)):
                    with open(f"{scans_directory}/{scan_files[int(choice) - 1]}", "r") as file:
                        results = json.load(file)
                        self.generate_table(scan_results=results)
                        buffer()
                else:
                    print("Invalid choice. Please try again.")
                    buffer()
        else:
            print("No scan results found.")
            buffer()


    def change_targets(self) -> None:
        self.targets = input("Enter the targets: ")
            

    def change_options(self) -> None:
        clear_screen()
        def toggle(option: str) -> None:
            if(self.options_dict[option] == "OFF"):
                self.options_dict[option] = "ON"
            else:
                self.options_dict[option] = "OFF"
        while 1:
            clear_screen()
            table_data = [
                ["X", "Scan Options", "Enabled"],
                ["1", "UDP Scan", self.options_dict["-sU"]],
                ["2", "TCP Scan", self.options_dict["-sT"]],
                ["3", "Top 10 Ports", self.options_dict["--top-ports 10"]],
                ["4", "Version Detection", self.options_dict["-sV"]],
                ["5", "Script Scan", self.options_dict["-sC"]],
                ["6", "Traceroute", self.options_dict["--traceroute"]],
                ["7", "OS Detection", self.options_dict["-O"]],
                ["8", "Back", ""]
            ]
            TABLE: SingleTable = SingleTable(table_data)
            TABLE.inner_row_border = 1
            for row in TABLE.table_data:
                if row[2] == 'ON':
                    row[2] = Fore.GREEN + row[2] + Fore.RESET
                elif row[2] == 'OFF':
                    row[2] = Fore.RED + row[2] + Fore.RESET
            print(TABLE.table)
            choice = input(">> ")
            match choice:
                case "1":
                    toggle("-sU")
                case "2":
                    toggle("-sT")
                case "3":
                    toggle("--top-ports 10")
                case "4":
                    toggle("-sV")
                case "5":
                    toggle("-sC")
                case "6":
                    toggle("--traceroute")
                case "7":
                    toggle("-O")
                case "8":
                    return
                case _:
                    print("Invalid choice. Please try again.")
                    buffer()
    def initialize_values(self) -> None:
        self.options = ""
        for option, status in self.options_dict.items():
            if(status == "ON"):
                self.options += option + " "
        self.options = self.options.strip()
        

    def run(self):
        """
        Starts the scan
        """
        if(not self.main_menu()):
            return
        print("Checking status of hosts...")
        live_hosts = self.is_alive()
        if(live_hosts is True):
            scan_results = self.perform_scan()
            FILE_NAME = dt.now().strftime("%Y-%m-%d_%H-%M-%S") + ".txt"
            self.generate_table(scan_results)
            with open("./results/" + self.targets + FILE_NAME, "w") as f:
                f.write(json.dumps(scan_results))
            print("Scan results have been saved to ./results/" + FILE_NAME)
            buffer()
        else:
            print("Host is either dead or blocking ICMP packets.")
            input("Press enter to continue...")
            clear_screen()