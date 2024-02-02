const input = require('readline-sync')
const sha256 = require('js-sha256')
const fs = require('fs')
const checkLogin = (username, password) => {
    const json = JSON.parse(fs.readFileSync('members.json'))
    for (let i = 0; i < json.length; i++) {
        console.log(`Comparing username \n->${sha256(username)}\n->${json[i].username}`)
        console.log(`\nComparing password \n->${sha256(password)}\n->${json[i].password}\n`)
        if ((sha256(username) === json[i].username) && (sha256(password) === json[i].password)) {
            return true
        }
    }
    return
}
while (true) {
    var username = input.question("Username: ")
    var password = input.question("Password: ")
    if (checkLogin(username, password)) { break }
    console.log("Invalid login. ")
}
console.log("Successfully logged in.")