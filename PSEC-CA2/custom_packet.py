from scapy.all import send, IP, TCP, ICMP, UDP
from terminaltables import SingleTable
from termcolor import colored
import os
import regex as re
def clear_screen(): 
    os.system('cls' if os.name == 'nt' else 'clear')
class PacketHandler:
    def __init__(self):
        """
        This class is used to handle the custom packet generator.
        """
        self.source_ip = ""
        self.source_ip_valid = False
        self.destination_ip = ""
        self.destination_ip_valid = False
        self.source_port = ""
        self.source_port_valid = False
        self.destination_port = ""
        self.destination_port_valid = False
        self.protocol = ""
        self.protocol_valid = False
        self.payload = ""

    def uncolor(self):
        """
        This function is used to remove the color from the terminal. Before sending the packet, the color is removed.
        """
        self.source_ip = re.sub(r'\x1b\[[0-9;]*m', '', self.source_ip)
        self.destination_ip = re.sub(r'\x1b\[[0-9;]*m', '', self.destination_ip)
        self.source_port = re.sub(r'\x1b\[[0-9;]*m', '', self.source_port)
        self.destination_port = re.sub(r'\x1b\[[0-9;]*m', '', self.destination_port)
        self.protocol = re.sub(r'\x1b\[[0-9;]*m', '', self.protocol)

    def send_packet(self, number_of_packets: int):
        """
        This function is used to send the packet.

        Args:
            number_of_packets (int): The number of packets to send.
        """
        self.uncolor()
        if("TCP" in self.protocol):
            packet = IP(src=self.source_ip, dst=self.destination_ip)/TCP(sport=int(self.source_port), dport=int(self.destination_port))/self.payload
        elif("UDP" in self.protocol):
            packet = IP(src=self.source_ip, dst=self.destination_ip)/UDP(sport=int(self.source_port), dport=int(self.destination_port))/self.payload
        elif("ICMP" in self.protocol):
            packet = IP(src=self.source_ip, dst=self.destination_ip)/ICMP(type=8)/self.payload
        send(packet, count=number_of_packets)

    def generate_table(self):
        """
        This function is used to generate the table.
        """
        if(self.source_ip_valid == False):
            self.source_ip = colored(self.source_ip, 'red', attrs=['bold'])
        else:
            self.source_ip = colored(self.source_ip, 'green', attrs=['bold'])
        if(self.destination_ip_valid == False):
            self.destination_ip = colored(self.destination_ip, 'red', attrs=['bold'])
        else:
            self.destination_ip = colored(self.destination_ip, 'green', attrs=['bold'])
        if(self.source_port_valid == False):
            self.source_port = colored(self.source_port, 'red', attrs=['bold'])
        else:
            self.source_port = colored(self.source_port, 'green', attrs=['bold'])
        if(self.destination_port_valid == False):
            self.destination_port = colored(self.destination_port, 'red', attrs=['bold'])
        else:
            self.destination_port = colored(self.destination_port, 'green', attrs=['bold'])
        if(self.protocol_valid == False):
            self.protocol = colored(self.protocol, 'red', attrs=['bold'])
        else:
            self.protocol = colored(self.protocol, 'green', attrs=['bold'])
        table_data = [
            ["", "OPTION", "VALUE"], 
            ["1", "Source", self.source_ip],
            ["2", "Destination", self.destination_ip],
            ["3", "Source Port", self.source_port],
            ["4", "Destination Port", self.destination_port],
            ["5", "Protocol", self.protocol],
            ["6", "Payload", self.payload]
        ]
        TABLE = SingleTable(table_data)
        TABLE.inner_row_border = 1
        print(TABLE.table)
    def send_input(self, option: int):
        """
        This function is called when the user tries to change a value from the table

        Args:
            option (int): Which option the user wants to change.
        """
        match option:
            case 1:
                self.source_ip = input("Enter the source address (http/s://) | www.example.com | x.x.x.x: ").replace(" ", "")
                if(self.validate_input(None, 2, 1) == True):
                    self.source_ip_valid = True
                else:
                    self.source_ip_valid = False
            case 2: 
                self.destination_ip = input("Enter the destination address (http/s://) | www.example.com | x.x.x.x: ").replace(" ", "")
                if(self.validate_input(None, 2, 2) == True):
                    self.destination_ip_valid = True
                else:
                    self.destination_ip_valid = False
            case 3:
                self.source_port = input("Enter the source port (0-65535): ").replace(" ", "")
                if(self.validate_input(None, 2, 3) == True):
                    self.source_port_valid = True
                else:
                    self.source_port_valid = False
            case 4:
                self.destination_port = input("Enter the destination port (0-65535): ").replace(" ", "")
                if(self.validate_input(None, 2, 4) == True):
                    self.destination_port_valid = True
                else:
                    self.destination_port_valid = False
            case 5: 
                self.protocol = input("Enter the protocol(TCP, IP, ICMP): ").replace(" ", "")
                if(self.validate_input(None, 2, 5) == True):
                    self.protocol_valid = True
                else:
                    self.protocol_valid = False
            case 6:
                self.payload = input("Enter the payload: ")
    def validate_input(self, user_input: (int or None), validation_type: int, validation_option: (int or None) )-> bool:
        """
        Validates an input from the user and returns a boolean value.
        This boolean value controls the color of the input in the table.

        Args:
            user_input (int): Input from the user.
            validation_type (int): Input by the script to determine the type of validation. (1 = Menu, 2 = Input)
            validation_option (int): Input by the script to determine the option of validation. (1 = Source IP, 2 = Destination IP, 3 = Source Port, 4 = Destination Port, 5 = Protocol)

        Raises:
            ValueError: If the user input is out of the specified range.

        Returns:
            bool: True if the input is valid, False if the input is invalid.
        """
        match validation_type:
            case 1:
                try:
                    user_input = int(user_input)
                    if user_input in (1, 2, 3, 4, 5, 6):
                        return True
                    else:
                        raise ValueError
                except ValueError:
                    return False
            case 2:
                match validation_option:
                    case 1:
                        if (
                            re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", self.source_ip)
                            ) or (
                            re.match(r"^www\.[a-zA-Z0-9]+\.com$", self.source_ip)
                            ) or (
                            re.match(r"^https?://www\.[a-zA-Z0-9]+\.com$", self.source_ip)
                            ) or (
                            re.match(r"^https?://[a-zA-Z0-9]+\.[a-z]{2,}$", self.source_ip)
                            ):
                            return True
                        else:
                            return False
                    case 2:
                        if (
                            re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", self.destination_ip)
                            # xxx.xxx.xxx.xxx
                        ) or (
                            re.match(r"^www\.[a-zA-Z0-9]+\.[a-z]{2,}$", self.destination_ip)
                            # www.example.com
                        ) or (
                            re.match(r"^https?://www\.[a-zA-Z0-9]+\.[a-z]{2,}$", self.destination_ip)
                            # https://www.example.com
                            # http://www.example.com
                        ) or (
                            re.match(r"^https?://[a-zA-Z0-9]+\.[a-z]{2,}$", self.destination_ip)
                            # https://example.com
                            # http://example.com
                        ):
                            return True
                        else:
                            return False
                    case 3:
                        try:
                            self.source_port = int(self.source_port)
                            if self.source_port in range(0, 65536):
                                return True
                            else:
                                raise ValueError
                        except ValueError:
                            return False
                    case 4:
                        try:
                            self.destination_port = int(self.destination_port)
                            if self.destination_port in range(0, 65536):
                                return True
                            else:
                                raise ValueError
                        except ValueError:
                            return False
                    case 5:
                        if self.protocol in ("TCP", "UDP", "ICMP"):
                            return True
                        else:
                            return False
    def run(self):
        """
        Runs the script to start generating a custom packet

        Raises:
            ValueError: When the user selects an invalid number of packets to be sent.
        """
        while True:
            clear_screen()
            self.generate_table()
            print("Enter the option you want to change. Enter '!' to send the packet. '?' to exit.")
            option = input(">> ")
            if option == "?":
                return
            elif option == "!":
                if(
                    self.source_ip_valid == True and
                    self.destination_ip_valid == True and
                    self.source_port_valid == True and
                    self.destination_port_valid == True and
                    self.protocol_valid == True
                ):
                    print("How many packets do you want to send?")
                    packet_count = input(">> ")
                    try:
                        packet_count = int(packet_count)
                        if packet_count > 0:
                            self.send_packet(packet_count)
                            input("Press enter to continue...")
                            return
                        else:
                            raise ValueError
                    except ValueError:
                        print("Invalid packet count. Try again.")
                        input("Press enter to continue...")
                else:
                    print("Please fill in the following fields: ")
                    if self.source_ip_valid == False:
                        print("- Source IP")
                    if self.destination_ip_valid == False:
                        print("- Destination IP")
                    if self.source_port_valid == False:
                        print("- Source Port")
                    if self.destination_port_valid == False:
                        print("- Destination Port")
                    if self.protocol_valid == False:
                        print("- Protocol")
                    input("Press enter to continue...")
            else:
                if self.validate_input(option, 1, None):
                    self.send_input(int(option))
                else:
                    print("Invalid option. Try again.")
                    input("Press enter to continue...")
            


