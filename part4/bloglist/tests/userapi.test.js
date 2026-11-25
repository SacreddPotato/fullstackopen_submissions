const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user inside the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)

        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const insertedUser = await api.post('/api/users').send({ username: 'test', password: 'password' }).expect(201).expect('Content-Type', /application\/json/)
        const updatedUsers = await api.get('/api/users')

        assert.strictEqual(updatedUsers.body.length, 2)
        assert.deepStrictEqual(updatedUsers.body[1], insertedUser.body)
    })

    test('creation with a duplicate username returns 400 with a `unique` username error', async () => {
        const response = await api.post('/api/users').send({ username: 'root', password: 'password' }).expect(400)
        assert(response.body.error.includes('expected `username` to be unique'))
    })

    describe('creating a user with short username or password returns 400 with appropiate messages', () => {
        test('creation of a user with a short username', async () => {
            const response = await api.post('/api/users').send({ username: 't', password: 'password' }).expect(400)
            assert(response.body.error.includes('username') && response.body.error.includes('shorter than'))
        })

        test('creation of a user with a short password', async () => {
            const response = await api.post('/api/users').send({ username: 'test', password: 'p' }).expect(400)
            assert(response.body.error.includes('password') && response.body.error.includes('3 characters'))
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})