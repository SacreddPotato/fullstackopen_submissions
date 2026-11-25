const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : null

    if (!(user && passwordCorrect)) return res.status(400).json({ error: 'invalid username or password' })

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res.status(200).send({ token: token, username: user.username, id: user._id })
})

module.exports = loginRouter