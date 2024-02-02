from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
import socket
FTP_PORT = 2121
FTP_DIRECTORY = "./ftpServerData"
FTP_ADDRESS = socket.gethostbyname(socket.gethostname())

def main():
    authorizer = DummyAuthorizer()
    handler = FTPHandler
    handler.authorizer = authorizer
    authorizer.add_anonymous(FTP_DIRECTORY, perm="elradfmw") 
    handler.banner = "Welcome to PSEC FTP Server! "
    handler.passive_ports = range(60000, 65535)
    address = (FTP_ADDRESS, FTP_PORT)
    server = FTPServer(address, handler)
    server.serve_forever()


if __name__ == '__main__':
    main()