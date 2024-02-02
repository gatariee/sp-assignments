import hashlib
from timeit import default_timer as t
def hashCracker(hash):
    with open(wordlist, 'rb') as file:
        for line in file:
            for word in line.split():
                if(hash == hashlib.sha256(word).hexdigest()):
                    print(f'Hash found! The unhashed string is: {word.decode()}')
                    return
        print("Not found. ")
wordlist = "../lists/wordlist.txt"
hashes = "../lists/hashes.txt"
def chooseWord():
    with open(hashes, 'rb') as file:
        for line in file:
            for hash in line.split():
                hashCracker(hash.decode())
def main():
    start = t()
    chooseWord()
    end = t()
    print("Time taken: ", round(end - start, 5), "seconds")