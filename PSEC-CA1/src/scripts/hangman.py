"""
Main Program

Script name:
    hangman.py

Purpose:
    This script is a hangman game that allows the user to play hangman 

Usage syntax:
    python hangman.py

Input file:
    ./scripts/admin.py
    ./scripts/hangman.py
    ./scripts/banner.py
    ./scripts/style.py


Output file:
    ./data/game_logs.txt
    ./data/game_settings.txt
    ./data/word_list.txt

Python Version:
    Python 3.11

Reference:
https://stackoverflow.com/questions/2769061/how-to-erase-the-file-contents-of-text-file-in-python
https://stackoverflow.com/questions/17140886/how-to-search-and-replace-text-in-a-file-using-python
https://stackoverflow.com/questions/287871/how-do-i-print-colored-text-to-the-terminal

Library/Module:
- these modules are installed by default in Python 3.11
    - hashlib
    - random
    - json
    - os
    - time
    - datetime
    - getpass
    - sys

Known Issues:
    - The global variable is referenced a lot in the code.
        - This means that the code may not be safe to be used in a multi-threaded environment.
        - You may want to consider using a class to store the global variables, if you choose to use this code in a multi-threaded environment.
        - I am aware this is not the best practice, but I am not sure how to implement it in this case.

"""
import random
import json
import os
import time as t
from datetime import date
from styles import Styles as colours
from banner import hm_banner
#
COLORS = colours()
PADDING = "-" * 40
PADDING2 = "=" * 40

# change working directory to the script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Game:
    def __init__(self, player_name) -> None:
        """
        Initializes the attributes of the Game class.

        Args:
            player (str): Input name of player
        """
        self.name = player_name
        self.word, self.meaning, self.difficulty, self.space, self.index_of_space = pick_word()
        self.guesses = 0
        self.previous_guesses = []
        self.incorrect_list = []
        self.guess_progress = "_ " * len(self.word)

        # Note that the attributes are quite extensive as they are used in multiple functions.
        # This is reset every time the player starts a new game.
    def end_banner(self, format) -> None:
        if(format == 1):
            print(
            f"After {len(self.incorrect_list)} incorrect guesses and "
            f"{len(self.previous_guesses)-len(self.incorrect_list)} correct guesses. \n"
            f"The word was \"{self.word}\".\n"
            f"Its meaning is: '{self.meaning}'"
            )
        elif(format == 2):
            formatted_word = (self.word).replace("_", " ")
            print(
            f"After {len(self.incorrect_list)} incorrect guesses and "
            f"{len(self.previous_guesses)-len(self.incorrect_list)} correct guesses. \n"
            f"The word was \"{formatted_word}\".\n"
            f"Its meaning is: '{self.meaning}'"
            )
    def calculate_points(self) -> int:
        """
        Calculates the points earned by the player based on their guess.

        Returns:
            int: The points earned
        """
        # Remove underscores and spaces from the guess_progress string
        stripped_guess_progress = self.guess_progress.replace("_", "").replace(" ", "")

        # Calculate the points earned by multiplying the number of correct letters by 2
        points = len(stripped_guess_progress) * 2

        return points

    def guess_letter(self, letter: str) -> None:
        """
        Processes the player's guess and updates the game state.

        Args:
            letter (str): The letter guessed by the player
        """

        def validate_guess() -> bool:
            """
            This function validates the input of the player.
            """
            # list of lowercase, uppercase, and punctuation characters allowed in the input
            LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
            # UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            PUNCTUATION = "'!?,"
            ALLOWED_CHARS = LOWERCASE + PUNCTUATION

            # check if the input is a single character
            if len(letter) != 1:
                os.system("cls")
                print(PADDING)
                print(COLORS.pr_red(s = "Please enter a single letter."))
                return False

            # check if the input is an allowed character
            if letter not in ALLOWED_CHARS:
                os.system("cls")
                print(PADDING)
                print(COLORS.pr_red(s = "Please enter a valid character."))
                return False

            # check if the input has been previously guessed
            if letter in self.previous_guesses:
                os.system("cls")
                print(PADDING)
                print(COLORS.pr_red(s = "You have already guessed that letter."))
                return False

            # if the input is valid, return True
            return True

        def update_guess_progress(count: int) -> int:
            """
            This function updates the guess_progress string.
            """
            # loop through each character in the word
            for i, char in enumerate(self.word):
                # if the character matches the guessed letter,
                # increment the count and update the guess_progress string
                if char == letter.lower():
                    count+=1
                    self.guess_progress = (
                        self.guess_progress[: i * 2]
                        + letter.lower()
                        + self.guess_progress[i * 2 + 1 :]
                    )
            return count
        # Validation
        if not validate_guess():
            return

        # initialize a count variable
        count = 0

        # check if the guessed letter is in the word
        if letter.lower() in self.word:
            count = update_guess_progress(count)

        # if the letter is not in the word,
        # increment the number of guesses and add the letter to the incorrect_list
        if (count == 0):
            self.guesses += 1
            self.incorrect_list.append(letter)
            os.system("cls")
            print(
                f"{PADDING}\nIncorrect! You have "
            + str(SETTINGS["guesses"] - self.guesses)
            + " guesses left. "
        )

        # if there are more than one of the guessed letter in the word,
        # print a message indicating the number of occurrences of the letter
        
        elif count > 1:
            os.system("cls")
            print(
                f"{PADDING}\nCongratulations. There are "
                + str(count)
                + " "
                + letter
                + "'s. "
            )

        # if there is only one of the guessed letter in the word,
        # print a message indicating the occurrence of the letter
        elif count == 1:
            os.system("cls")
            print(f"{PADDING}\nCongratulations. There is 1 " + letter + ". ")

        # append the guessed letter to the previous_guesses list
        self.previous_guesses.append(letter)
    
    def banner(self, session: int, user_choice: int) -> None:
        if user_choice == 1:
            os.system("cls")
            print(f"Welcome to Hangman, {self.name}!")
        elif user_choice == 2:
            def format_phrase(phrase: str) -> str:
                for i in self.index_of_space:
                    phrase = (
                        phrase[: i * 2] + " " + phrase[i * 2 + 1 :]
                    )
                return phrase
            print("Session: {} / {}".format(session, SETTINGS["sessions"]))
            if len(self.index_of_space) > 0: 
                # If the word contains a space(phrase)
                formatted_phrase = format_phrase(self.guess_progress)
                print("Phrase: {}".format(formatted_phrase))
            else:
                # normal game, word
                print("Word: {}".format(self.guess_progress))
            print(
                "Incorrect Guesses ({}): {}".format(
                    len(self.incorrect_list), ", ".join(self.incorrect_list)
                )
            )
            print(
                "Correct Guesses: {}".format(
                    ", ".join(list(set(self.previous_guesses) - set(self.incorrect_list)))
                )
            )
            print("Guesses remaining: {}".format(SETTINGS["guesses"] - self.guesses))
            hm_banner(2, self.guesses)

    def solve_vowels(self, vowels: list) -> None:
        """
        This function solves the vowels in the word.

        Args:
            game (object): This is the game object.
            vowels (vowels): This is a list of vowels in the word.
        """
        vowels_unique = set(vowels)  # Convert vowels to a set to remove duplicates

        for i, char in enumerate(self.word):
            if char in vowels_unique:
                self.guess_progress = self.guess_progress[:i*2] + char + self.guess_progress[i*2+1:]
                self.previous_guesses.append(char)
        # this is essentially the same as the update_guess_progress function
        # but it is used for vowels
        # a better way to do this would be to use a for loop and pipe all the vowels into update_guess_progress
        # but I'm too lazy to do that
    def use_lifeline(self) -> None:
        """
        Prints the lifelines menu and allows the user to use a lifeline.
        """
        global lifeline_vowel, lifeline_meaning, meaning_usage
        temp_vowels = COLORS.pr_green("Show Vowels")
        temp_meaning = COLORS.pr_green("Show Meaning")
        if lifeline_vowel:
            temp_vowels = COLORS.pr_red(s = "Show Vowels")
        if lifeline_meaning:
            temp_meaning = COLORS.pr_red(s = "Show Meaning")

        while 1:
            os.system("cls")
            print(
            f"{PADDING}\n{COLORS.pr_bold('Lifelines')}\n\n"
            f"1. {temp_vowels}\n"
            f"2. {temp_meaning}\n"
            f"3. Back\n"
            )
            if(lifeline_meaning and meaning_usage['word'] == self.word): 
                # checks if the current word is the same as the word used in the meaning lifeline
                # if it is, then it prints the meaning
                # if it isn't, then it doesn't print the meaning
                print(f"{COLORS.pr_green('Meaning: ')}{self.meaning}")
            print(PADDING)
            lifeline = input("Enter lifeline: ")
            check, err = validate_input(user_input=lifeline, user_choice=3)
            if check:
                break
            print(err)
            input("Press enter to continue. ")

        if int(lifeline) == 1:
            if lifeline_vowel is True:
                print(COLORS.pr_red(s = "You have already used this lifeline. "))
                return
            os.system("cls")
            vowels = find_vowels(self.word)
            if len(vowels) == 0:
                print(COLORS.pr_red(s = "No vowels found. "))
            else:
                # Create a dictionary of vowels and their count
                vowel_obj = {"a": 0, "e": 0, "i": 0, "o": 0, "u": 0}
                for vowel in vowels:
                    vowel_obj[vowel] += 1
                # there's probably a better way to do this
                # but I'm too lazy to figure it out
                print(PADDING)
                print(COLORS.pr_green("\nVowels found! \n"))
                for key, value in vowel_obj.items():
                    if value > 0:
                        print(f"{key} - {value}")
                # print the vowels found
                print(f"{PADDING}\n")
                input("Press enter to continue. ")
                self.solve_vowels(vowels)
                # solve the vowels in self.guess_progress
                lifeline_vowel = True
                # set lifeline_vowel to True so that the user can't use it again
                os.system("cls")
        elif int(lifeline) == 2:
            if lifeline_meaning is True:
                os.system("cls")
                print(COLORS.pr_red(s = "You have already used this lifeline. "))
                return
            lifeline_meaning = True
            os.system("cls")
            print(f"\n\n{PADDING}\n")
            print(f'The meaning of the word is: \n"{self.meaning}"\n')
            # print the meaning of the word
            meaning_usage = {'word': self.word}
            # set the meaning_usage dictionary to the current word
            # so that the meaning can be accessed in the lifeline menu again
        elif int(lifeline) == 3:
            os.system("cls")

def end_game(log_file: dict) -> None:
    """
    This function is called when the game ends.

    Args:
        log_file (dict): The log file
    """
    # Open the game_logs.txt file in read-write mode
    with open("../data/game_logs.txt", "r+") as f:
        if os.stat("../data/game_logs.txt").st_size == 0:
            # If the file is empty, create a new list with the log_file as the first element
            log_list = [log_file]
        else:
            # If the file is not empty, read the existing log file and append the log_file
            log_list:list = json.loads(f.read())
            log_list.append(log_file)

        # Convert the log_list to a JSON_formatted string ( this is unnecessary but i like it )
        log_string = json.dumps(log_list, indent=4)

        # Overwrite the existing game_logs.txt file with the new log_string
        f.seek(0)
        f.truncate(0)
        f.write(log_string)

    # Print the game ending message
    print(f"\n\tYou have ended the game with {COLORS.pr_green(s = log['points'])} points.".expandtabs(30))
    print(
        f"\n\tPlayer Log: \n\t{PADDING}\n\t    Name: {log['player']}\n\t    Points: {log['points']}\n\t    Date: {log['date']}\n\t{PADDING}\n\n".expandtabs(30)
        + PADDING2*2 + '\n\n'
        )


def pick_word() -> tuple[str, str, str, bool, int]:
    """
    This function picks a random word from the word list.

    Returns:
        word (str): The word to be guessed
        word_meaning (str): The meaning of the word
        difficulty (str): The difficulty of the word
        space (bool): Whether the word contains a space
        index_of_space (int): The index of the space in the word

    """

    def read_words() -> list:
        """Reads the list of words from a file and returns it as a list of dictionaries.

        Returns:
            list: This is a list of dictionaries, where each dictionary contains information
                about a single word, including the word itself, its meaning, and its difficulty.
        """
        try:
            with open("../data/word_list.txt", "r") as f:
                wordlist = json.loads(f.read())
                return wordlist
        except FileNotFoundError:
            print("Error, wordlist is empty. Please contact an administrator for assistance.")
            exit()

    wordlist = read_words()
    enabled_words = [word for word in wordlist if word["enabled"] == "on"]
    usable_words = [word for word in enabled_words if word["word"] not in previous_words]
    selected_word = random.choice(usable_words)
    previous_words.append(selected_word["word"])

    # unpack the selected word into separate variables
    word, word_meaning, difficulty = selected_word["word"], selected_word["meaning"], selected_word["difficulty"]

    space = False
    index_of_space = []

    # loop through each letter in the word
    for i, letter in enumerate(word):
        # check if the current letter is a space
        if letter == " ":
            # replace the space with an underscore
            word = word[: i] + "_" + word[i + 1 :]
            # add the index of the space to the index_of_space list
            index_of_space.append(i)
            # this will be useful later, i promise
            space = True
    return word, word_meaning, difficulty, space, index_of_space


def menu() -> int:
    """
    This function is the main menu of the game.

    Returns:
        user_input (int): The option chosen
    """
    while 1:
        os.system("cls")
        print("\n\n")
        t.sleep(0.1)
        hm_banner(1)  # ascii art
        t.sleep(0.05)
        print(
            COLORS.pr_bold(
                "\n---------------------------- ~ MENU ~ -----------------------------\n"
            )
        )
        t.sleep(0.05)
        print(COLORS.pr_bold("                        1. Start New Game\n"))
        t.sleep(0.05)
        print(COLORS.pr_bold("                        2. Print Leaderboard\n"))
        t.sleep(0.05)
        print(COLORS.pr_bold("                        3. Search Player\n"))
        t.sleep(0.05)
        print(COLORS.pr_bold("                        4. Exit\n"))
        user_input = input(">> ")
        check, err = validate_input(user_input=user_input, user_choice=2)
        if check:
            return int(user_input)
        input(f"{err}\nPress Enter to continue...")



def validate_input(user_input: str | int, user_choice: int) -> tuple[bool, str]:
    """
    All inputs are validated here

    Args:
        user_input (str/int): this is the user input, could be a string or an integer. name or option
        choice (int): this is the choice of validation. 1 for name, 2 for option, 3 for lifeline

    Returns:
        tuple(bool,str):
            bool: True if the input is valid, False if the input is invalid
            str: the error message if the input is invalid
    """
    if user_choice == 1:
        LOWERCASE = [chr(i) for i in range(97, 123)]
        UPPERCASE = [chr(i) for i in range(65, 91)]
        SP_CHARS = ["-", "/"]
        ALLOWED_CHARS = UPPERCASE + LOWERCASE + SP_CHARS
        # if you want to add more characters, add them to the ALLOWED_CHARS list
        if not all(char in ALLOWED_CHARS for char in user_input) or len(user_input) == 0:
            return False, "Please enter a valid name. "

        # Check if the file is empty
        if os.stat("../data/game_logs.txt").st_size == 0:
            return True, None

        # Check if the name is already taken
        with open("../data/game_logs.txt", "r") as f:
            game_log = json.loads(f.read())
            for value in game_log:
                if value["player"].lower() == user_input.lower():
                    return False, "This name is already taken. "
        return True, None

    if user_choice == 2:
        if not user_input.isnumeric():
            return False, COLORS.pr_red(s = "Please enter a valid option.")
        options = [1, 2, 3, 4]
        for option in options:
            if int(user_input) == option:
                return True, None
        return False, COLORS.pr_red(s = "Please enter a valid option. ")

    if user_choice == 3:
        options = ["1", "2", "3"]
        if user_input not in options:
            return False, COLORS.pr_red(s = "Please enter a valid option. ")
        return True, None

def find_vowels(word: str) -> list[str]:
    """
    Finds the vowels in the word and returns a list of vowels.

    Args:
        word (str): The word the player has to guess.

    Returns:
        list[str]: The vowels in the word.
    """
    vowels = ["a", "e", "i", "o", "u"]
    return [char for char in word if char in vowels]



def print_leaderboard(num: int) -> None:
    """
     Prints the leaderboard, showing the top players in terms of points.

    Args:
        num (_type_): this is the number of players to be displayed in the leaderboard
    """

    def read_logs() -> list:
        """
        This function reads the game logs and returns a dictionary of the logs

        Returns:
            logs (dict): this is the game log
        """
        try:
            with open("../data/game_logs.txt", "r") as f:
                return(json.loads(f.read()))
        except FileNotFoundError:
            print("Error. Game logs not found. ")

    logs = read_logs()
    logs.sort(key=lambda x: x["points"], reverse=True)
    # sort the logs in descending order of points
    # the top player will be at the top of the list
    print(f"{PADDING}\n LEADERBOARD (Top {num})\n{PADDING}")
    for i, value in enumerate(logs):
        if i == num:
            break
        print(f"{i+1}. {value['player']} - {value['points']}")
        # this i+1 thing is just to make the leaderboard look better
    print(f"{PADDING}\n")


def search_player() -> None:
    """
    This function searches for a player in the game logs
    """

    def read_logs() -> list:
        """
        This function reads the game logs and returns a dictionary of the logs

        Returns:
            logs (dict): this is the game log
        """
        try:
            with open("../data/game_logs.txt", "r") as f:
                return(json.loads(f.read()))
        except FileNotFoundError:
            print("Error. Game logs not found. ")

    logs = read_logs()
    name = input("Enter Player Name: ")
    for item in logs:
        if item["player"].lower() == name.lower():
            print(f"{PADDING}\n{item['player']} - {item['points']} points\n{PADDING}")
            return
    print(f"{PADDING}\nPlayer not found. \n{PADDING}")


def init_game_settings() -> dict | None:
    """
    Returns the game SETTINGS.

    Returns:
        dict: The game SETTINGS.
    """
    try:
        with open("../data/game_settings.txt") as f:
            game_settings: dict = json.loads(f.read())
            game_settings["sessions"] = game_settings.pop("number of sessions", None)
            game_settings["guesses"] = game_settings.pop("number of guesses", None)
            game_settings["top"] = game_settings.pop("number of top players", None)
            return game_settings
            # completely unnecessary but it looks nicer
    except FileNotFoundError:
        print("Error. game_settings.txt not found. ")
        return None


def main() -> None:
    """
    This is the main function
    """
    while 1:  # loops until check is true
        player_name = input("Enter your name: ")
        check, err = validate_input(user_input=player_name, user_choice=1)
        # check if the input is valid
        if check:
            # if the input is valid,
            begin(player_name=player_name)
            break
        print(err)


def begin(player_name: str) -> None:
    """
    this function begins the game

    Args:
        player_name (str): this is the player's name
    """
    global SESSION, lifeline_vowel, lifeline_meaning
    hang_man = Game(player_name=player_name)

    # Display banner on the first session (important)
    if SESSION == 1:
        hang_man.banner(session=SESSION, user_choice=1)

    # Keep playing until player runs out of guesses or guesses the word
    while (hang_man.guesses < SETTINGS["guesses"]) and (
        (hang_man.guess_progress).replace(" ", "") != hang_man.word
    ):
        # Calculate the player's points at the start of every guess
        hang_man.calculate_points()
        # Display the game banner
        hang_man.banner(session=SESSION, user_choice=2)
        # Ask player to guess a letter or activate a lifeline
        guess = input("Guess ('0' to activate lifeline): ")

    # If player chooses to activate a lifeline
        if guess == "0":
            os.system('cls')
            hang_man.use_lifeline()

        # If player chooses to guess a letter
        else:
            guess = guess.lower()
            hang_man.guess_letter(letter=guess)
        print(PADDING)

    # The while loop has been exited, so the player has either guessed the word or run out of guesses
    if hang_man.guesses == SETTINGS["guesses"]:
        hm_banner(2, 5)
        print(COLORS.pr_red(s = "\nYou have reached the maximum number of guesses. "))

    else:
        print(COLORS.pr_green("\nWell Done! You have guessed the word. "))
    if hang_man.space is False: 
        # formatting without spaces(type = Idiom-Proverbs)
        hang_man.end_banner(format = 1)
    else: 
        # formatting with spaces(type = Word)
        hang_man.end_banner(format = 2)
    if SESSION < SETTINGS["sessions"]:
        # The game is over BUT there are still more sessions to be played.
        SESSION += 1
        log["points"] += hang_man.calculate_points()
        print(f"Your total points are {COLORS.pr_bold(s = log['points'])}.\n")
        print(f"{PADDING}\n")
        input("Press enter to continue. ")
        os.system("cls")
        begin(player_name)
    else:
        if log["points"] > 15:
            # I'm going to be honest, I don't know what this does
            # But this was in the requirements
            input("Press enter to continue... ")
            os.system('cls')
            hm_banner(3)
            print(PADDING2*2)
            print(
                f"\n\tCongratulations! You have {COLORS.pr_green(s = 'won')} the game! "
                .expandtabs(30))
        else:
            print(PADDING2*2)
            print(f"\n\tYou have {COLORS.pr_red(s = 'lost')} the game. ".expandtabs(30))
        log["points"] += hang_man.calculate_points()
        log["player"] = (hang_man.name).capitalize()
        end_game(log_file=log)



if __name__ == "__main__":
    # initialize game settings, please don't change this midgame
    try:
        SETTINGS = init_game_settings()
        while 1:
            choice = menu()
            match choice:
                case 1:
                    # reset game settings
                    lifeline_vowel = False
                    lifeline_meaning = False
                    SESSION = 1
                    previous_words = []
                    log = {
                        "player": "",
                        "points": 0,
                        "date": date.today().strftime("%d/%m/%y"),
                    }
                    main()
                case 2:
                    print_leaderboard(num=int(SETTINGS["top"]))
                case 3:
                    search_player()
                case 4:
                    exit()
            input("Press Enter to continue...")
    except KeyboardInterrupt:
        print(COLORS.pr_red(s = ("\nThank you for playing. ")))
        exit()
