 // Class to store all functions and processes
// Note that some variables are repeated but within the scope of the function so there will be no overlap.
// Note that json is reinitialized in every function as the values in json may change during the flow of the program.
// json = [{},{},{}, ...]
// fs.readFileSync = open .json as json
// fs.writeFileSync = save .json as json

const fs = require('fs')
const input = require('readline-sync')
const clc = require('cli-color');
const sha256 = require('js-sha256');
const red = clc.red
const green = clc.green
const bold = clc.bold
class Member {
    constructor(name, birthdate) {
        // A new instance of Member is spawned with the following properties with 2 arguments.
        this.name = name
        this.birthdate = birthdate
        this.type = "Ruby"
        // --------------------------------------------------------------------------- //
        // Finds out today's date and returns the date in the format that is required.
        // Note that .getMonth() seems to print June as the 5th month. 
        // I don't know why it's like this but apparently it's an intentional feature. 
        // Probably to better fit with arrays of months? e.g Jan = 0; [Jan,Feb]
        // As a result, there is an addition of 1 to month.
        // --------------------------------------------------------------------------- //
        let newDate = () => {
            const d_t = new Date()
            var year = d_t.getFullYear()
            var month = d_t.getMonth() + 1
            var day = d_t.getDate()
            const months = [
                '0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
            ]
            for (let i = 0; i < months.length; i++) {
                if (month == i) {
                    month = months[i]
                }
            }
            return (`${day} ${month} ${year}`)
        }
        this.join_date = newDate()
        this.points = 0
        this.UID = Math.floor(Math.random() * 90000) + 10000
        this.draws = 0
    }
    /*                                              
    =================================================
                    Admin Panel
    =================================================
                                                    */
    newAdmin() { // Create new administrator user
        console.log(clc.red("\tWARNING! This action can not be reversed. Are you sure you want to continue? (y/n)"))
        var userInput = input.question(">> ")
        var json = JSON.parse(fs.readFileSync('admins.json'))
        if (userInput == "y" || userInput == "Y") {
            console.log(clc.green("A 5-digit admin ID has been randomly generated. Please enter a password."))
            var id = Math.floor(Math.random() * 90000) + 10000; // Creates a random integer from 1-99999 (5-digit)
            var pw = input.question("Password: ")
            var obj = {
                adminID: sha256(id.toString()), // SHA-256 encode the values for added security
                password: sha256(pw) // Passwords shouldn't be stored in plaintext
            }
            json.push(obj) // Push the admin account object to json.
            fs.writeFileSync('admins.json', JSON.stringify(json, null, "\t")) // Rewrite it into admins.json
            console.log(green("\nAdmin successfully created. "))
            console.log("**** Your admin ID is: " + bold(id) + " ****")
        } else {
            console.log("Returning...")
            return;
        }
    }
    checkAdmin() { // This is done when the user selects (1) Admin || (2) User
        var json = JSON.parse(fs.readFileSync('admins.json'))
        do {
            var adminID = input.question("Please enter your admin ID: ")
            if (isNaN(adminID)) {
                console.log(red("Admin ID should be a number."))
            }
        } while (isNaN(adminID))
        var adminPW = input.question("Please enter your admin password: ", { hideEchoBack: true }); // Note that password-input does not allow backspaces
        for (let i = 0; i < json.length; i++) {
            // Default admin login: 12345, 'admin'
            if (json[i].adminID == sha256(adminID)) {
                if (json[i].password == sha256(adminPW)) {
                    return true; // checkAdmin() returns true if the account credentials are validated.
                }
            }
        }
        return false;
    }

    /*                                              
    =================================================
                        Main Menu Options
    =================================================
                                                    */

    // Option 1: Display all members' information. ------------------------------------------------------------------------
    printMembers() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        const keys = ['name', 'type', 'join_date', 'birthdate', 'points']
        const syntax = ['Name: ', 'Membership Type: ', 'Date Joined: ', 'Date of Birth: ', 'Points Earned: ']
        for (let i = 0; i < json.length; i++) {
            for (let x = 0; x < keys.length; x++) {
                console.log(syntax[x] + bold(json[i][keys[x]]));
            }
            console.log('')
        }
    }
    // Option 2: Display member information. --------------------------------------------------------------------------
    displayMember() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var counter = 0
        var str = ""
        for (let i = 0; i < json.length; i++) {
            str += json[i].name + ", "
        }
        str = str.replace(/,\s*$/, ""); // Removes the comma at the end.
        console.log(`List of available members: ${green(str)}`)
        var userInput = input.question("Please enter member's name: ")
        console.log('')
        for (let i = 0; i < json.length; i++) {
            var result = json[i]['name']
            if (result.toLowerCase() == userInput.toLowerCase()) { // non-case-sensitive.
                counter++
                console.log('Name: ' + bold(json[i].name))
                console.log('Membership Type: ' + bold(json[i].type))
                console.log('Date Joined: ' + bold(json[i].join_date))
                console.log('Date of Birth: ' + bold(json[i].birthdate))
                console.log('Points Earned: ' + bold(json[i].points))
            }
        } if (counter == 0) { // Validation failed.
            console.log(red("Member does not exist."))
        }
    }
    // Option 3: Add new member -----------------------------------------------------------------------
    menuAddMember() {
        const func = new Member()
        var json = JSON.parse(fs.readFileSync('members.json'))
        while (true) {
            var counter = 0
            var memberName = input.question("Please enter member's name: ")
            if (!(isNaN(memberName))) { // Validation of name input
                console.log(red("Invalid name input. Please try again."))
            } else { // Assume DOB is entered correctly.
                var memberDOB = input.question("Please enter member's date of birth: ")
                for (let i = 0; i < json.length; i++) {
                    if ((json[i].name).toLowerCase() == memberName.toLowerCase()) {
                        counter++
                    }
                }
                if (counter == 0) {
                    var memberAdd = new Member(memberName, memberDOB)
                    func.addMembers(memberAdd)
                    console.log(green(`${bold(memberName)} has successfully been added as a member.`))                    // Type is automatically set to Ruby(default).
                    // join_date is automatically set to the user's current date.
                    // points is automatically set to 0.
                    break;
                    // Validation passed.
                } else {
                    console.log(red("Member's name exists in database. Please enter a new name."))
                } // Validation failed. Retrying..
            }
        }
    }
    addMembers(user) {
        var json = JSON.parse(fs.readFileSync('members.json'))
        // json contains an array of objects which can be called with json[index][key] or json[index].key
        json.push(user)
        console.log(green(`UID has been automatically generated: ${bold(user.UID)}`))
        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
    }
    // Option 4: Delete existing member --------------------------------------------------------------------
    deleteMembers() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var counter = 0
        var str = ""
        for (let i = 0; i < json.length; i++) {
            str += json[i].name + ", "
        }
        str = str.replace(/,\s*$/, ""); // Removes the comma at the end.
        console.log(`List of available members: ${green(str)}`)
        while (true) {
            var userName = input.question("Please enter member name: ")
            for (let i = 0; i < json.length; i++) {
                if (userName.toLowerCase() == (json[i].name).toLowerCase()) {
                    var index = i
                    counter++
                    break;
                }
            }
            if (counter != 0) { // Passed validation
                var str = userName.toLowerCase()
                var str2 = str.charAt(0).toUpperCase() + str.slice(1)
                console.log(green(`${bold(str2)} has successfully been removed from the member list.`))
                json.splice(index, 1) // Removes (1) Element from the index of the user.
                fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                return;
            } else {
                console.log(red(`${userName} is not a member.`))
                while (true) {
                    console.log("Would you like to retry? (y/n)")
                    var selection = input.question(">> ")
                    if (selection == "y" || selection == "Y") {
                        break;
                    } else if (selection == "n" || selection == "N") {
                        return;
                    } else {
                        console.log(red("Invalid input."))
                    }
                }
            }
        }
    }
    // Option 5: Edit existing member ------------------------------------------------------------------------
    editMember() {
        console.log(clc.red("Note that changes to membership type/points are dangerous, proceed with caution."))
        const func = new Member()
        while (true) {
            var json = JSON.parse(fs.readFileSync('members.json'))
            var counter = 0
            var str = ""
            for (let i = 0; i < json.length; i++) {
                str += json[i].name + ", "
            }
            str = str.replace(/,\s*$/, ""); // Removes the comma at the end
            console.log(`List of available members: ${green(str)}`)
            var userName = input.question("Please enter member name: ")
            for (let i = 0; i < json.length; i++) {
                if (userName.toLowerCase() == (json[i].name).toLowerCase()) {
                    var index = i
                    counter++ // If counter is not incremented, the following if statement will not be entered.
                    break;
                }
            }
            if (counter != 0) { // Only enters this statement if counter has been incremented
                console.log("What would you like to change?")
                console.log(`\t(1) Name`)
                console.log(`\t(2) Type`)
                console.log(`\t(3) Birthdate`)
                console.log(`\t(4) Joined Date`)
                console.log(`\t(5) Points`)
                console.log(`\t(0) Exit`)
                var selection = parseFloat(input.question(">> "))
                if (isNaN(selection)) {
                    console.log(clc.red('Invalid Input.'))
                    break;
                }
                switch (selection) {
                    case 1:
                        console.log(`You have selected: ${bold('Name')}`)
                        console.log(`Please enter the new value: `)
                        var newChange = input.question(">> ")
                        if (!isNaN(newChange)) {
                            console.log(clc.red("Invalid Input."))
                            break;
                        }
                        var name = json[index].name
                        json[index].name = newChange
                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                        console.log(`Username has been changed from ${bold(name)} to ${bold.green(newChange)}`)
                        return;
                    case 2:
                        console.log(`You have selected: ${bold('Type')}`)
                        console.log(clc.red(`Take note that any updates to the points will automatically recalculate the membership type, which may overwrite your changes. `))
                        console.log(`Please enter the new value:`)
                        var newChange = input.question(">> ")
                        if (!isNaN(newChange)) {
                            console.log(clc.red("Invalid Input."))
                            break;
                        }
                        if (newChange != 'Ruby' && newChange != 'Gold' && newChange != 'Platinum' && newChange != 'Diamond') {
                            console.log(clc.red("Please enter a valid membership type."))
                            break;
                        }
                        var type = json[index].type
                        json[index].type = newChange
                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                        console.log(`Type has been changed from ${bold(type)} to ${bold.green(newChange)}`)
                        return;
                    case 3:
                        console.log(`You have selected: ${bold('Birthdate')}`)
                        console.log(`Please enter the new value:`)
                        var newChange = input.question(">> ") // Assume birthday is enterred correctly.
                        var birthdate = json[index].birthdate
                        json[index].birthdate = newChange
                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                        console.log(`Birthdate has been changed from ${bold(birthdate)} to ${bold.green(newChange)}`)
                        return;
                    case 4:
                        console.log(`You have selected: ${bold('Joined Date')}`)
                        console.log(`Please enter the new value:`)
                        var newChange = input.question(">> ") // Assume dates are entered correctly
                        var joined_date = json[index].join_date
                        json[index].join_date = newChange
                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                        console.log(`Joined date has been changed from ${bold(joined_date)} to ${bold.green(newChange)}`)
                        return;
                    case 5:
                        console.log(`You have selected: ${bold('Points')}`)
                        console.log(clc.red(`Note that changes to points will automatically update membership type, edit with caution.`))
                        console.log(`Please enter the new value:`)
                        var newChange = parseFloat(input.question(">> ")) // Changing this is dangerous.
                        if (isNaN(newChange)) {
                            console.log(clc.red("Please input a valid integer."))
                            break;
                        }
                        var points = json[index].points
                        json[index].points = newChange
                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                        console.log(`Points has been changed from ${bold(points)} to ${bold.green(newChange)}`)
                        func.refreshPoints()
                        return;
                    case 0:
                        return;
                    default:
                        console.log(red("Invalid Option."))
                }
            } else {
                console.log(`${bold(userName)} is not a member.`)
            }
        }
    }
    // Option 6: Update points earned --------------------------------------------------------------
    menuUpdateMember() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        const func = new Member()
        var counter = 0
        var pointsEarned = 0
        var str = ""
        for (let i = 0; i < json.length; i++) {
            str += json[i].name + ", "
        }
        str = str.replace(/,\s*$/, ""); // Removes the comma at the end.
        console.log(`List of available members: ${green(str)}`)
        var userInput = input.question("Please enter member's name: ")
        if (!(isNaN(userInput))) {
            console.log(red("Invalid name input. Please try again. "))
        } else {
            var amountSpent = input.questionInt("Please enter amount spent: ")
            if (amountSpent < 0) {
                console.log(red("Input value can not be negative.s"))
            } else {
                /* Identifying the index of userInput */
                /* --------------------------------------------------------- */
                for (let i = 0; i < json.length; i++) {
                    if (userInput.toLowerCase() == (json[i].name).toLowerCase()) {
                        var index = i
                        counter++
                    }
                }
                if (counter == 0) {
                    console.log(red("Member does not exist."))
                    return
                    /* ----------------------------------------------------------*/
                } else { // Identifying the change in points for amountSpent
                    if (amountSpent <= 50) {
                        pointsEarned = 10
                    } else if (amountSpent <= 100) {
                        pointsEarned = 50
                    } else if (amountSpent <= 200) {
                        pointsEarned = 100
                    } else if (amountSpent <= 500) {
                        pointsEarned = 200
                    } else if (amountSpent <= 1000) {
                        pointsEarned = 500
                    } else if (amountSpent <= 2500) {
                        pointsEarned = 1000
                    } else {
                        pointsEarned = 2000
                    }
                }
            }
        }
        func.editPoints(index, pointsEarned)
        func.refreshPoints()
    }
    editPoints(index, change) {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var before = json[index]['points']
        var key = json[index]['points'] + change // 'change' argument is passed into the function from the main program
        var after = key
        json[index]['points'] = key
        console.log(green(`Points have succesfully been updated from ${bold(before)} to ${bold(after)}.`))
        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
    }
    refreshPoints() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        for (let i = 0; i < json.length; i++) {
            if (json[i].points < 500) {
                json[i]['type'] = "Ruby"
            } else if (json[i].points < 5000) {
                if ((json[i]['type']) != 'Gold') {
                    console.log(`\nMembership type has been updated from ${bold(json[i].type)} to ${bold.yellow('Gold')}.`)
                }
                json[i]['type'] = "Gold"
            } else if (json[i].points < 20000) {
                if ((json[i]['type']) != 'Platinum') {
                    console.log(`\nMembership type has been updated from ${bold(json[i].type)} to ${bold.blue('Platinum')}.`)
                }
                json[i]['type'] = "Platinum"
            } else {
                if ((json[i]['type']) != 'Diamond') {
                    console.log(`\nMembership type has been updated from ${bold(json[i].type)} to ${bold.magenta('Diamond')}.`)
                }
                json[i]['type'] = "Diamond"
            }
            fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
        }
    }
    // Option 7: Statistics(Sub-Menu)
    statMenu1() {
        var strName = ""
        var counter = 0
        var json = JSON.parse(fs.readFileSync('members.json'))
        console.log(green(`List of available membership types: Ruby, Gold, Platinum, Diamond`))
        var userInput = input.question("Enter Membership Type: ") // Validation of userInput. 
        while (userInput.toLowerCase() != 'ruby' && userInput.toLowerCase() != 'diamond' && userInput.toLowerCase() != 'gold' && userInput.toLowerCase() != 'platinum') {
            console.log(clc.red("Please enter a valid membership type."))
            var userInput = input.question("Enter Membership Type: ")
        }
        for (let i = 0; i < json.length; i++) {
            // Note that only one 'if' conditional can be entered depending on userInput, so separating the counters for each membership type is redundant.
            if (userInput.toLowerCase() == (json[i].type).toLowerCase()) { // if userInput(type) matches the object type, save the name.
                if (counter == 0) {
                    // Beautify the formatting :)
                    strName += json[i].name
                    counter++
                } else {
                    strName += ", " + json[i].name
                    counter++
                }
            }
            // Limitations of this implimentation is if the program is expected to collate the total number of members of several membership types.
        }
        var str = userInput.toLowerCase()
        var str2 = str.charAt(0).toUpperCase() + str.slice(1)
        console.log(`There are ${bold(counter)} members in the membership type: ${bold(str2)}`)
        console.log(`Member(s) of selected membership type: ${clc.green(bold(strName))}`)
    }
    statMenu2() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        var bdayList = []
        /* Finding the 'Number of days away from BC'*/
        // Logic: Convert json[i].DOB to days. 
        // e.g 27 Jan 2020 = 27 + 0(1) + 2020(365)
        // Smaller = Older ***

        for (let i = 0; i < json.length; i++) {
            var bday = json[i].birthdate
            var bdayArr = bday.split(' ') // bdayArr = ['days', 'months', 'year']
            var days = parseInt(bdayArr[0]) // index 0 = days, index 1 = months, index 2 = year
            var years = parseInt(bdayArr[2])
            var month = 0
            for (let x = 0; x < months.length; x++) {
                if (bdayArr[1] == months[x]) { // bdayArr = [day,month,year]
                    month += (x + 1)
                }
            }
            var total = days + month * 30 + years * 365
            bdayList.push(total)
            // bdayList is an array containing the number of days since BC to birthdate. E.g 25 Feb 0000 -> 25 + 2(30)
        }
        // Now, we sort through the array and find the largest and smallest integer and the corresponding index
        // Smallest integer -> Oldest
        // Largest integer -> Youngest

        var oldest = bdayList[0]
        var oldestName = ''
        var oldestDate = ''
        for (let i = 1; i < bdayList.length; i++) {
            if (bdayList[i] < oldest) {
                oldestName = json[i].name
                oldestDate = json[i].birthdate
            } else {
                oldestName = json[0].name
                oldestDate = json[0].birthdate
            }
        }
        // The value of oldest and youngest do not matter here.
        // Iteration in the opposite order to find the largest integer(youngest)
        var youngest = bdayList[0]
        var youngestName = ''
        var youngestDate = ''
        for (let i = 1; i < bdayList.length; i++) {
            if (bdayList[i] > youngest) {
                youngestName = json[i].name
                youngestDate = json[i].birthdate
            } else {
                youngestName = json[0].name
                youngestDate = json[0].birthdate
            }
        }
        console.log(`Youngest member: ${bold(youngestName)} (${youngestDate})`)
        console.log(`Oldest member: ${bold(oldestName)} (${oldestDate})`)
    }

    statMenu3() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var highest = Number.NEGATIVE_INFINITY // Might be redundant as points always start 0
        var highestName = ""
        var lowest = Number.POSITIVE_INFINITY // Incase points can be negative?
        var lowestName = ""
        for (let i = 0; i < json.length; i++) {
            if (json[i].points > highest) {
                highest = json[i].points
                highestName = json[i].name
            }
            else if (json[i].points < lowest) {
                lowest = json[i].points
                lowestName = json[i].name
            }
        }
        console.log(`Highest is ${clc.bold(highestName)} with ${clc.bold(highest)} points.`)
        console.log(`Lowest is ${clc.bold(lowestName)} with ${clc.bold(lowest)} points.`)
    }
    statMenu4() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var ruby = 0
        var gold = 0
        var platinum = 0
        var diamond = 0
        for (let i = 0; i < json.length; i++) {
            if (json[i].type == 'Ruby') {
                ruby++
            } else if (json[i].type == 'Gold') {
                gold++
            } else if (json[i].type == 'Platinum') {
                platinum++
            } else {
                diamond++
            }
        }
        console.log(`\t\tRuby: ${ruby}`)
        console.log(`\t\tGold: ${gold}`)
        console.log(`\t\tPlatinum: ${platinum}`)
        console.log(`\t\tDiamond: ${diamond}\n`)
    }
    statMenu5() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var ruby = 0
        var gold = 0
        var platinum = 0
        var diamond = 0
        for (let i = 0; i < json.length; i++) {
            if (json[i].type == 'Ruby') {
                ruby += json[i].points
            } else if (json[i].type == 'Gold') {
                gold += json[i].points
            } else if (json[i].type == 'Platinum') {
                platinum += json[i].points
            } else {
                diamond += json[i].points
            }
        }
        console.log(`\t\tRuby: ${ruby}`)
        console.log(`\t\tGold: ${gold}`)
        console.log(`\t\tPlatinum: ${platinum}`)
        console.log(`\t\tDiamond: ${diamond}\n`)
    }
    statMenu6() {
        var json = JSON.parse(fs.readFileSync('members.json'))
        var sum = 0
        var counter = 0
        for (let i = 0; i < json.length; i++) {
            sum += json[i].points
            counter++
        }
        console.log(`The average points among ${counter} members is ${sum / counter}.`)
    }
    restoreBackup() {
        const input = require('readline-sync')
        do {
            console.log(red('This action can not be undone, are you sure you want to continue? (y/n)'))
            var userInput = input.question('>> ')
            if (userInput == 'n' || userInput == 'N') { return } continue;
        } while (userInput != 'y' && userInput != 'Y')
        var json_backup = JSON.parse(fs.readFileSync('members_backup.json'))
        fs.writeFileSync('members.json', JSON.stringify(json_backup, null, "\t"))
        var admin_backup = JSON.parse(fs.readFileSync('admins_backup.json'))
        fs.writeFileSync('admins.json', JSON.stringify(admin_backup, null, "\t"))
        console.log(green("Restoration to backup was successful."))
        console.log(green(`Admin ID: ${bold('12345')}`))
        console.log(green(`Password: ${bold('admin')}`))
    }


     /*                                              
    =================================================
            Additional Features: Lucky Draw
    =================================================
                                                    */
    checkUID(UIDinput) {
        var input = require('readline-sync')
        var json = JSON.parse(fs.readFileSync('members.json'))
        for (let i = 0; i < json.length; i++) {
            if (UIDinput == json[i]['UID']) {
                return i
            }
        }
        return false
    } 
    // A UID is to identify a member through a unique identifier(hence, UID)
    // the purpose of this function is to identify if -1)The UID exists. and 2)Who the UID belongs to and grab the index of the person
    shopMenu(index) { // This is the bulk of the function.
        const check = (cost) => { 
            // I noticed that the checking of points was getting repetitive so I turned it into a function
            var json = JSON.parse(fs.readFileSync('members.json'))
            if (json[index].points < cost) {
                return false
            } else {
                return true
            }
        }
        var input = require('readline-sync')
        var json = JSON.parse(fs.readFileSync('members.json'))
        var func = new Member()
        console.log(green(`\nSuccessfully logged in as ${bold(json[index]['name'])}\n`))
        while (userInput != 5) {
            console.log('\t1. Check Balance')
            console.log('\t2. Check Draws')
            console.log('\t3. Shop')
            console.log('\t4. Spend Draws')
            console.log('\t5. Exit')
            var userInput = input.questionFloat('>> ')
            switch (userInput) {
                case 1:
                    console.log(`\nYou currently have: ${json[index]['points']} points.\n`)
                    break;
                case 2:
                    console.log(`\nYou have ${json[index]['draws']} draws.\n`)
                    break;
                case 3:
                    do {
                        console.log(`\n\t\t1. 1 Lucky Draw (100)\n\t\t2. 5 Lucky Draws (500)\n\t\t3. 10 Lucky Draws (1000)\n\t\t4. Back\n`)
                        var drawInput = input.questionInt(">> ")
                        if (drawInput == 1) {
                            // Check if user has enough balance
                            if (check(100)) { // check(100) returns a true/false boolean value depending if points are validated
                                do { 
                                    // and this long do-while loop is repeated 3 times for the 3 choices. 
                                    // 1 lucky draw = 100 points. 
                                    // hence points -100, and draws +1 and save it back to members.json
                                    console.log(red("You are buying ONE Lucky Draw for 100 points. Continue? (y/n)"))
                                    var yn = input.question(">> ")
                                    if (yn == 'y' || yn == 'Y') {
                                        json[index]['points'] = json[index]['points'] - 100
                                        json[index]['draws'] = json[index]['draws'] + 1
                                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                                        console.log(green(`Purchase Successful. You have purchased: ${bold('ONE')} Lucky Draw.\nYou have: ${bold(json[index]['points'])} points remaining.`))
                                    } else if (yn == 'n' || yn == 'N') {
                                        break;
                                    } else {
                                        console.log('Invalid input')
                                    }
                                } while (yn != 'y' && yn && 'Y' && yn != 'n' && yn != 'N')
                            } else { // if check(100) returns false, it will prompt the else statement
                                console.log(red("Insufficient Points."))
                            }
                        } else if (drawInput == 2) {
                            if (check(500)) {
                                do {
                                    console.log(red("You are buying FIVE Lucky Draw for 500 points. Continue? (y/n)"))
                                    var yn = input.question(">> ")
                                    if (yn == 'y' || yn == 'Y') {
                                        json[index]['points'] = json[index]['points'] - 500
                                        json[index]['draws'] = json[index]['draws'] + 5
                                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                                        console.log(green(`Purchase Successful. You have purchased: ${bold('FIVE')} Lucky Draws.\nYou have: ${bold(json[index]['points'])} points remaining.`))
                                    } else if (yn == 'n' || yn == 'N') {
                                        break;
                                    } else {
                                        console.log('invalid input')
                                    }
                                } while (yn != 'y' && yn && 'Y' && yn != 'n' && yn != 'N')
                            } else {
                                console.log(red("Insufficient Points."))
                            }
                        } else if (drawInput == 3) {
                            if (check(1000)) {
                                do {
                                    console.log(red("You are buying TEN Lucky Draw for 1000 points. Continue? (y/n)"))
                                    var yn = input.question(">> ")
                                    if (yn == 'y' || yn == 'Y') {
                                        json[index]['points'] = json[index]['points'] - 1000
                                        json[index]['draws'] = json[index]['draws'] + 10
                                        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
                                        console.log(green(`Purchase Successful. You have purchased: ${bold('TEN')} Lucky Draws.\nYou have: ${bold(json[index]['points'])} points remaining.`))
                                    } else if (yn == 'n' || yn == 'N') {
                                        break;
                                    } else {
                                        console.log('Invalid Input.')
                                    }
                                } while (yn != 'y' && yn && 'Y' && yn != 'n' && yn != 'N')
                            } else {
                                console.log(red("Insufficient Points."))
                            }
                        } else if (drawInput == 4) { 
                            // since points are deducted here, we will check for any changes in memtype
                            console.log(`Checking for any changes...`)
                            func.refreshPoints()
                            break;
                        } else {
                            console.log("Invalid Input.")
                        }
                    } while (drawInput != 4)
                    break;
                case 4:
                    if (json[index].draws == 0) { // alternatively this can be replaced with if(draws > 0) {} 
                        console.log("Oops, it seems like you have no draws!")
                        break;
                    }
                    do {
                        console.log('\t\t1. 2x Multiplier 33%') // 1 in 3
                        console.log('\t\t2. 5x Multiplier 25%') // 1 in 4
                        console.log('\t\t3. 10x Multiplier 16%') // 1 in 6
                        console.log('\t\t4. 15x Multipler 10%') // 1 in 10
                        console.log('\t\t5. Exit') 
                        var selection = input.question('>> ')
                        if (selection == 1 || selection == 2 || selection == 3 || selection == 4) {
                            console.log(`How many draws do you want to use? ${bold(json[index].draws)} draws remaining.`)
                            do {
                                var numDraws = input.question('>> ')
                                if (numDraws > json[index].draws) {
                                    console.log('Invalid number of draws. Please try again.')
                                    break;
                                }
                            } while (numDraws > json[index].draws)
                            func.luckyDraw(index, selection, numDraws)
                            return;
                        } else if (selection == 5) {
                            continue;
                        } else {
                            console.log('Invalid Input')
                        }

                    } while (selection != 5)
                    break;
                case 5:
                    console.log('Exiting...')
                    break;
                default:
                    console.log("Invalid Input.")
            }
        }
    }
    luckyDraw(index, selection, num) { 
        // this is a very simple game, 
        // a random number is generated depending on the selection of the user
        // then the user is prompted to enter a number
        // and if the user's input and the RNG matches, the counter is incremented
        // at the end of the game, the counter will be multiplied by 100 points(the cost of one LD) and then the multipler will be applied.
        var counter = 0
        var winnings = 0
        var input = require('readline-sync')
        var json = JSON.parse(fs.readFileSync('members.json'))
        var func = new Member()
        for (let i = 0; i < num; i++) {
            switch (selection) {
                case '1':
                    var drawnNumber = Math.floor(Math.random() * 3) + 1
                    console.log("\nA random number has been generated between 1 and 3. Try to guess it: ")
                    var guess = input.question('>> ')
                    if (drawnNumber == guess) {
                        console.log(green("You have guessed correctly."))
                        counter++
                    } else {
                        console.log(red(`The number was ${drawnNumber}. Too bad.`))
                    }
                    break;
                case '2':
                    var drawnNumber = Math.floor(Math.random() * 4) + 1
                    console.log("\nA random number has been generated between 1 and 4. Try to guess it: ")
                    var guess = input.question('>> ')
                    if (drawnNumber == guess) {
                        console.log(green("You have guessed correctly."))
                        counter++
                    } else {
                        console.log(red(`The number was ${drawnNumber}. Too bad.`))
                    }
                    break;
                case '3':
                    var drawnNumber = Math.floor(Math.random() * 6) + 1
                    console.log("\nA random number has been generated between 1 and 6. Try to guess it: ")
                    var guess = input.question('>> ')
                    if (drawnNumber == guess) {
                        console.log(green("You have guessed correctly."))
                        counter++
                    } else {
                        console.log(red(`The number was ${drawnNumber}. Too bad.`))
                    }
                    break;
                case '4':
                    var drawnNumber = Math.floor(Math.random() * 10) + 1
                    console.log("\nA random number has been generated between 1 and 10. Try to guess it: ")
                    var guess = input.question('>> ')
                    if (drawnNumber == guess) {
                        console.log(green("You have guessed correctly."))
                        counter++
                    } else {
                        console.log(red(`The number was ${drawnNumber}. Too bad.`))
                    }
                    break;
            }
        }
        console.log('=========================================')
        const before = json[index]['points'] // no changes have been made to the points yet, i save it as const before
        json[index]['draws'] = json[index]['draws'] - num
        switch (selection) {
            case '1': winnings = (100 * 2) * counter
                console.log(`Multiplier: 2x`)
                break;
            case '2': winnings = (100 * 5) * counter
                console.log(`Multiplier: 5x`)
                break;
            case '3': winnings = (100 * 10) * counter
                console.log(`Multiplier: 10x`)
                break;
            case '4': winnings = (100 * 15) * counter
                console.log(`Multiplier: 15x`)

        }
        json[index]['points'] = json[index]['points'] + winnings
        const after = json[index]['points'] // the points have now changed, now we can compare the difference
        console.log(`You won ${bold(counter)} out of ${bold(num)} rounds. `)
        console.log(`Your total winnings are: ${green(winnings)} points.`)
        console.log(`Your points have been updated from ${bold(before)} to ${bold(after)}`) // this is a neat little feature
        func.refreshPoints()
        console.log('=========================================')
        fs.writeFileSync('members.json', JSON.stringify(json, null, "\t"))
    }
}

module.exports = Member