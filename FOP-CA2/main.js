// Imports
const input = require('readline-sync');
const Member = require('./class')
const p = require('./print')
const clc = require('cli-color')
const bold = clc.bold
// Class Imports
const func = new Member()

console.log(`\nWelcome to ${bold.green('XYZ Membership Loyalty Programme')}`)

do {
    var userName = input.question("Please enter your name: ")
    var valid = userName.match(/\d+/g) // Checks if string input contains numbers
    if (valid != null) {
        console.log(clc.red("Invalid input. Note that name can not contain numbers."))
    } else if (userName.length < 1) {
        console.log(clc.red("Invalid input"))

    }
} while (valid != null || userName.length < 1)

while (adminInput != 1 && adminInput != 2) {
    var check = false;
    var admin = false;
    console.log(`Are you an ${bold.red('admin')} or a ${bold('user?')}`)
    console.log('(1) Admin')
    console.log('(2) User')
    var initialInput = input.question(">> ")
    if (isNaN(initialInput) || initialInput.length < 1 || initialInput.match(/\d+/g).length > 1) { // contains comma (1) = > [1]
        console.log(clc.red("Invalid input")) // enter this.
        continue;
    } else {
        var adminInput = parseFloat(initialInput)
    }
    if (adminInput == 1) {
        var adminSelection = bold.red('Admin')
        console.log(`You have selected: ${adminSelection}`)
        while (check == false) {
            var check = func.checkAdmin()
            if (check == false) {
                console.log(clc.red(`Invalid login. Would you like to retry? (y/n)`))
                var retry = input.question(">> ")
                if (retry == "y" || retry == "Y") {
                    continue;
                } else if (retry == 'n' || retry == 'N') {
                    check = true;
                } else {
                    console.log(clc.red("Invalid input. Continuing..."))
                    check = true
                }
            } else {
                console.log(clc.green(`\nLogin Successful.`))
                admin = true;
            }
        }
    } else if (adminInput == 2) {
        var adminSelection = bold('User')
        console.log(`You have selected: ${adminSelection}`)
    } else {
        console.log(clc.red("Invalid input"))
    }
}
// Options Selection
while (userInput != 9) { // Repeats loop until 9 is entered.
    console.log("\nHi " + bold(userName) + ", please select your choice: ")
    if (admin) {
        p.printAdminMenu()
    } else {
        p.printMenu()
    }
    var userInput = parseFloat(input.question('>> '))
    switch (userInput) {
        case 1:
            console.clear()
            func.printMembers()
            break;
        case 2:
            console.clear()
            func.displayMember()
            break;
        case 3:
            console.clear()
            if (admin) {
                func.menuAddMember()
            } else {
                console.log(clc.red("Sorry! This option is for administrators only."))
            }
            break;
        case 4:
            console.clear()
            if (admin) { // Ensuring that only administrators can access these options
                func.deleteMembers()
            } else {
                console.log(clc.red("Sorry! This option is for administrators only."))
            }
            break;
        case 5:
            console.clear()
            if (admin) {
                func.editMember()
            } else {
                console.log(clc.red("Sorry! This option is for administrators only."))
            }
            break;
        case 6:
            console.clear()
            if (admin) {
                func.menuUpdateMember()
            } else {
                console.log(clc.red("Sorry! This option is for administrators only."))
            }
            break;
        case 7:
            console.clear()
            subInput = undefined
            while (subInput != 7) {
                p.printsubMenu()
                var subInput = parseFloat(input.question("\t >> "))
                switch (subInput) {
                    case 1:
                        console.clear()
                        func.statMenu1()
                        break;
                    case 2:
                        console.clear()
                        func.statMenu2()
                        break;
                    case 3:
                        console.clear()
                        func.statMenu3()
                        break;
                    case 4:
                        console.clear()
                        func.statMenu4()
                        break;
                    case 5:
                        console.clear()
                        func.statMenu5()
                        break;
                    case 6:
                        console.clear()
                        func.statMenu6()
                        break;
                    case 7:
                        break;
                    default: console.log(clc.red("Please select a valid option."))
                }
            }
            break;
        case 8:
            do {
                console.log("Please enter your UID")
                var userUID = input.question(">> ")
                var userIndex = func.checkUID(userUID)
                if (userIndex == false) {
                    console.log(clc.red(`UID not found in database.`))
                    break;
                } else {
                    func.shopMenu(userIndex)
                    break;
                }
            } while (true)
            break;
        case 9:
            console.log('Exiting...')
            return;
        case 0:
            if (admin) {
                do {
                    p.adminPanel()
                    var panelInput = input.questionFloat('>> ')
                    switch (panelInput) {
                        case 1: func.restoreBackup()
                            break;
                        case 2: func.newAdmin()
                            break;
                        case 0:
                            console.log('Exiting...')
                            break;
                        default:
                            console.log(clc.red("Invalid input."))

                    }
                } while (panelInput != 0)
            } else {
                console.log(clc.red("Invalid input."))
            }
            break;
        default:
            console.log(clc.red("Invalid input."))
            break;
    }
}