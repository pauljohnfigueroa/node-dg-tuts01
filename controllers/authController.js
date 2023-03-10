// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
const User = require('../model/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const fsPromises = require('fs').promises
// const path = require('path')


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })

    // const foundUser = usersDB.users.find(person => person.username === user)
    const foundUser = await User.findOne({ username: user }).exec()
    if (!foundUser) return res.sendStatus(401) // Unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean)
        // this is where we create JWT
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    'username': foundUser.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '180s' }
        )
        const refreshToken = jwt.sign(
            { 'username': foundUser.username, },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // save refresh token with the current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        // const currentUser = { ...foundUser, refreshToken }
        // usersDB.setUsers([...otherUsers, currentUser])

        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // )
        // set cookie maxAge to 1 day, also add {secure: true} to use https, in production
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // put back secure: true
        res.json({ roles, accessToken })

    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }