from passlib.hash import sha256_crypt
import argparse
parser = argparse.ArgumentParser(description="script")
parser.add_argument("-v", "--verbose", action="store_true")
s = input("Enter shadow line: ")
s_split = s.split(":")[1].split("$")[1:]
wordlist = "../lists/wordlist.txt"
def shadowCrack(hash):
    with open(wordlist, "rb") as file:
        for line in file:
            for word in line.split():
                a = sha256_crypt.hash(word, rounds=5000, salt=s_split[1]) 
                if vars(parser.parse_args())["verbose"]:
                    print(f"Trying password: {word.decode()}")
                    print(f"Comparing input 1: {hash}")
                    print(f'Comparing input 2: {a.split("$")[3]}')
                if hash == a.split("$")[3]:  # Comparing input hash with wordlist
                    print(f"Password found! The password is: {word.decode()}")
                    return
        print("Not found. ")


shadowCrack(s_split[2])