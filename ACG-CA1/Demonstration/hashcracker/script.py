import hashlib
def hashCracker(hash):
    with open(wordlist, 'rb') as file:
        for line in file:
            for word in line.split():
                print(f"Input: {hash}\nWordlist: {hashlib.sha256(word).hexdigest()}\n") 
                if(hash == hashlib.sha256(word).hexdigest()):
                    print(f'Hash found! The unhashed string is: {word.decode()}')
                    return
        print("Not found. ")
wordlist = "wordlist.txt"

hash = input("Enter hash: ")
hashCracker(hash)