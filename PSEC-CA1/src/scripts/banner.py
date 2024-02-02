import os
import time as t
from styles import Styles as colours
import json
COLORS = colours()
PADDING = "=" * 25
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def admin_banner(num: int) -> None:
    """
    Prints the admin banner
    Args:
        num (int): The index of the banner to print
    """
    if num == 1:
        os.system("cls")
        print(COLORS.pr_bold((f"{PADDING} ~ MENU ~ {PADDING}\n")))
        print(
            f"\t\tYou have selected: {COLORS.pr_bold('Word Settings')}\n\n{COLORS.pr_bold(PADDING * 2 + '==========')}\n"
        )
        print(f"\t\t\t{COLORS.pr_bold('1')}: Add word")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('2')}: Remove word")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('3')}: Edit word")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('4')}: View wordlist")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('5')}: {COLORS.pr_red('*** Reset Words ***')}")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('6')}: Toggle Words")
        t.sleep(0.05)
        print(f"\t\t\t{COLORS.pr_bold('7')}: Back")
    elif num == 2:

        print(
            COLORS.pr_green(
                (
                    r"""
 █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗    ██████╗  █████╗ ███╗   ██╗███████╗██╗     
██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║    ██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
███████║██║  ██║██╔████╔██║██║██╔██╗ ██║    ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║    ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║    ██║     ██║  ██║██║ ╚████║███████╗███████╗
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
                                                                                      """
                )
            )
        )
    elif num == 3:
        try:
            with open("../data/game_settings.txt", "r") as f:
                if(os.stat("../data/game_settings.txt").st_size == 0):
                    raise FileNotFoundError
                obj = json.loads(f.read())
        except FileNotFoundError:
            with open("../data/game_settings.txt", "w") as f:
                settings_content = {'number of sessions': 5, 'number of guesses': 5, 'number of top players': 5}
                f.write(json.dumps(settings_content, indent = 4))
                obj = settings_content
        os.system("cls")
        print(COLORS.pr_bold((f"\n\n\n{PADDING} ~ MENU ~ {PADDING}\n")))
        print(f"\tYou have selected: {COLORS.pr_bold('Game Settings')}\n")
        t.sleep(0.05)
        print(f"\t\tNumber of sessions: {COLORS.pr_bold(obj['number of sessions'])}")
        t.sleep(0.05)
        print(
            f"\t\tNumber of guesses per session: {COLORS.pr_bold(obj['number of guesses'])}"
        )
        t.sleep(0.05)
        print(
            f"\t\tNumber of top players on leaderboard: {COLORS.pr_bold(obj['number of top players'])}\n\n{COLORS.pr_bold(PADDING * 2 + '==========')}\n"
        )
        print(f" {COLORS.pr_bold('1')}: Edit number of sessions")
        t.sleep(0.05)
        print(f" {COLORS.pr_bold('2')}: Edit number of attempts/guesses")
        t.sleep(0.05)
        print(f" {COLORS.pr_bold('3')}: Edit number of top players")
        t.sleep(0.05)
        print(f" {COLORS.pr_bold('4')}: Back\n")
    elif num == 4:
        os.system("cls")
        print(COLORS.pr_bold((f"{PADDING} ~ MENU ~ {PADDING}\n")))
        print(
            f"\tYou have selected: {COLORS.pr_bold('View Reports')}\n\n{COLORS.pr_bold(PADDING * 2 + '==========')}\n"
        )
        print(f"\t\t{COLORS.pr_bold('1')}: Print Leaderboard")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('2')}: Filter Log")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('3')}: Remove Log")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('4')}: Back")
    elif num == 5:
        os.system("cls")
        print(COLORS.pr_bold((f"{PADDING} ~ MENU ~ {PADDING}\n")))
        print(
            f"\tYou have selected: {COLORS.pr_bold('Admin Settings')}\n\n{COLORS.pr_bold(PADDING * 2 + '==========')}\n"
        )
        print(f"\t\t{COLORS.pr_bold('1')}: Create Admin")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('2')}: Delete Admin")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('3')}: View Admins")
        t.sleep(0.05)
        print(f"\t\t{COLORS.pr_bold('4')}: Back")
    elif num == 6:
        print(
            COLORS.pr_bold(s = 
                            r"""
            ██╗      ██████╗  ██████╗ ██╗███╗   ██╗
            ██║     ██╔═══██╗██╔════╝ ██║████╗  ██║
            ██║     ██║   ██║██║  ███╗██║██╔██╗ ██║
            ██║     ██║   ██║██║   ██║██║██║╚██╗██║
            ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║
            ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝
                                                """
                        )
        )


def hm_banner(*args: int) -> None:
    """
    hm_banner prints a banner to the console.

    Args:
    *args (int): A list of integers used to determine which banner to print.

    """
    if(args[0] == 1):
        print(
            COLORS.pr_red(s = 
            r"""
    ██╗  ██╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗
    ██║  ██║██╔══██╗████╗  ██║██╔════╝ ████╗ ████║██╔══██╗████╗  ██║
    ███████║███████║██╔██╗ ██║██║  ███╗██╔████╔██║███████║██╔██╗ ██║
    ██╔══██║██╔══██║██║╚██╗██║██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║
    ██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║
    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝"""
        )
        )
    elif(args[0] == 2):
        match(args[1]):
            case 0:
                print(
                    r"""
                    +---+
                    |   |
                        |
                        |
                        |
                        |
                    ========="""
                )
            case 1:
                print(
                    r"""
                    +---+
                    |   |
                    O   |
                    |   |
                        |
                        |
                    ========="""
                )
            case 2:
                print(
                    r"""
                    +---+
                    |   |
                    O   |
                   /|   |
                        |
                        |
                    ========="""
                )
            case 3:
                print(
                    r"""
                    +---+
                    |   |
                    O   |
                   /|\  |
                        |
                        |
                    ========="""
                )
            case 4:
                print(
                    r"""
                    +---+
                    |   |
                    O   |
                   /|\  |
                   /    |
                        |
                    ========="""
                )
            case 5:
                print(
                    r"""
                 +---+
                 |   |
                 O   |
                /|\  |
                / \  |
                     |
                ========="""
                )
    elif(args[0] == 3):
        print(COLORS.pr_green(r"""

    ██████  ████████ ███    ██  ██████  ██████   █████  ████████ ██    ██ ██       █████  ████████ ██  ██████  ███    ██ ███████ 
    ██      ██    ██ ████   ██ ██       ██   ██ ██   ██    ██    ██    ██ ██      ██   ██    ██    ██ ██    ██ ████   ██ ██      
    ██      ██    ██ ██ ██  ██ ██   ███ ██████  ███████    ██    ██    ██ ██      ███████    ██    ██ ██    ██ ██ ██  ██ ███████ 
    ██      ██    ██ ██  ██ ██ ██    ██ ██   ██ ██   ██    ██    ██    ██ ██      ██   ██    ██    ██ ██    ██ ██  ██ ██      ██ 
    ██████  ████████ ██   ████  ██████  ██   ██ ██   ██    ██     ██████  ███████ ██   ██    ██    ██  ██████  ██   ████ ███████                                                                                                                                                                                                                                         
            """))


