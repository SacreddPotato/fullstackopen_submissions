const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
    const { password, ...userData } = req.body // trying new things with spread operators
    const passwordHash = await bcrypt.hash(password, 10)

    if (password.length < 3) return res.status(400).json({ error: 'password mustt be at least 3 characters long' })

    const newUser = new User({ ...userData, passwordHash })
    const savedUser = await newUser.save()
    console.log('test')
    res.status(201).json(savedUser)
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')

    res.json(users)
})

module.exports = userRouter