
# PSEC-Hangman

Project for PSEC CA1 2022



## Navigation

- admin.py
    - administrative panel, requires login credentials for access
        - setup, add, remove, edit words and meanings in word_list.txt
        - define settings for the game, includes adding, remove and editing of various game perimeters
        - print report for games played
- hangman.py
    - game client, does not require credentials; for public-use
        - play hangman
        - print leaderboard
- data files
    - word_list.txt
        - contains the wordlist for the game
            ```
            {
                word: 'word',
                meaning: 'meaning',
                difficulty: 'simple/complex',
                type: 'word/idiom-proverbs',
                enabled: 'on/off'
            }
    - game_settings.txt
        - contains the settings for the game 
            ```
            {
                "number of guesses": x: int,
                "number of attempts": x: int,
                "number of words": x: int,
                "number of top players": x: int
            }
    - game_logs.txt
        - contains the report/logs of every game played
            ```
            {
                "player": "name",
                "points": x: int,
                "date": "dd/mm/yy"
            }
            ```
    - admin.txt
        - contains the login credentials for admin users
            ```
            {
                "username": username,
                "password": hash
            }
            ```
## Documentation

- [Admin](https://tbd)
    - User-guide for administrative purposes:
        - instructions on how to definition of game files
        - navigation guide of input-output files
        - instructions to how to properly run the script
        - troubleshooting 
- [Player](https://tbd)
    - User-guide for players to run the script:
        - how to correctly run the script 
        - general IT support 
        - troubleshooting to a reasonable extent
- [System](https://tbd)
    - User-guide for system administrators for long-term support:
        - application overview
            - illustrations of data flow
            - description of main functions for each script

## Installation

To deploy this project run

```bash
  git clone https://github.com/gatariee/PSEC-Hangman

  ~~~~~~~~~~ optional steps ~~~~~~~~~~
  |  python -m venv .env             |
  |  run ./.env/Scripts/activate.bat |
  |  pip install -m requirements.txt |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  cd ./PSEC-Hangman/src/scripts
  python hangman.py
```

