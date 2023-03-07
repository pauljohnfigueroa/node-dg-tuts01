// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

// const fsPromises = require('fs').promises
// const path = require('path')

const User = require('../model/User')

const handleLogout = async (req, res) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // No Content
    const refreshToken = cookies.jwt

    // is the refreshToken in the DB?
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }

    // delete refreshToken in DB
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)

    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    // const currentUser = { ...foundUser, refreshToken: '' } // delete refreshToken
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // )

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
}

module.exports = { handleLogout }