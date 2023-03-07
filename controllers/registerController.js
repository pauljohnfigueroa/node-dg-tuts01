// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

// const fsPromises = require('fs').promises
// const path = require('path')

const User = require('../model/User')

const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { username, password, email, phone } = req.body
    if (!username || !password || !email) return res.status(400).json({ 'message': 'Username, password, and email are required.' })

    // check for duplicate
    //const duplicate = usersDB.users.find(person => person.username === user)
    const duplicate = await User.findOne({ username }).exec()
    if (duplicate) return res.sendStatus(409) // code 409 is for conflict

    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // store the new user
        // const newUser = {
        //     "username": user,
        //     "roles": { "User": 2001 },
        //     "password": hashedPassword
        // }
        const result = await User.create({
            "username": username,
            "password": hashedPassword,
            "email": email,
            "phone": phone

        })
        console.log(result)
        // usersDB.setUsers([...usersDB.users, newUser])
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // )
        // console.log(usersDB.users)

        res.status(201).json({ 'success': `New user ${username} created.` })

    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }

}

module.exports = { handleNewUser }

