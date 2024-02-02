// Print Menus for 
const clc = require('cli-color');
const red = clc.red
const cyan = clc.cyan
const green = clc.green
function printMenu() {
    console.log("\t1. Display all members' information")
    console.log("\t2. Display member information")
    console.log(red("\t3. Add new member *"))
    console.log(red("\t4. Delete existing member *"))
    console.log(red("\t5. Edit existing member *"))
    console.log(red("\t6. Update points earned *"))
    console.log("\t7. Statistics")
    console.log("\t8. Shop")
    console.log("\t9. Exit")

}
// Separate printMenu for adminstrative users (Some options are highlighted in green rather than red)
// Option (0) is shown to administrator users only.
function printAdminMenu() {
    console.log("\t1. Display all members' information")
    console.log("\t2. Display member information")
    console.log(green("\t3. Add new member *"))
    console.log(green("\t4. Delete existing member *"))
    console.log(green("\t5. Edit existing member *"))
    console.log(green("\t6. Update points earned *"))
    console.log("\t7. Statistics")
    console.log("\t8. Shop")
    console.log("\t9. Exit")
    console.log(cyan("\t0. Admin Panel"))

}
function printsubMenu() {
    console.log("\t\t 1. Display names of (all) a certain type of members only.")
    console.log("\t\t 2. Display the name of the youngest and oldest member in the system.")
    console.log("\t\t 3. Display the name of the members with the highest and lowest points earned.")
    console.log("\t\t 4. Display total number of members in each membership type.")
    console.log("\t\t 5. Display the total points in each membership type.")
    console.log("\t\t 6. Display the total average number of points.")
    console.log("\t\t 7. Return to main-menu.")
}

function adminPanel() {
    console.log(cyan("\t1. Restore to backup"))
    console.log(cyan("\t2. Add new admin"))
    console.log(cyan("\t0. Exit"))

}
module.exports = {
    printMenu, printsubMenu, printAdminMenu, adminPanel
}


