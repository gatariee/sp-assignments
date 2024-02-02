class Styles:
    """
    This class is used to print colored text to the console
    """
    ANSI_COLORS = {
        "red": "\033[91m",
        "green": "\033[92m",
        "bold": "\033[1m",
        "reset": "\033[00m"
    }
    def pr_red(self, s: str) -> str:
        """
        Returns a string with red text.

        Args:
            s (str): The string to be printed.

        Returns:
            str: The string with red text.
        """
        return f"{self.ANSI_COLORS['red']}{s}{self.ANSI_COLORS['reset']}"
    def pr_green(self, s: str) -> str:
        """
        Returns a string with green text.

        Args:
            s (str): The string to be printed.

        Returns:
            str: The string with green text.
        """
        return f"{self.ANSI_COLORS['green']}{s}{self.ANSI_COLORS['reset']}"
    def pr_bold(self, s: str) -> str:
        """
        Returns a string with bold text.

        Args:
            s (str): The string to be printed.

        Returns:
            str: The string with bold text.
        """
        return f"{self.ANSI_COLORS['bold']}{s}{self.ANSI_COLORS['reset']}"
