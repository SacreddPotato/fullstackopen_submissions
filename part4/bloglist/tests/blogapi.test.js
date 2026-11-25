const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('fetching blogs returns the right amount of blogs in json format', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 2)
})

test('the identifier field for returned objects is named \'id\'', async () => {
    const response = await api.get('/api/blogs')

    assert(Object.keys(response.body[0]).includes('id'))
})

test('adding a new blog to the database is saved correctly', async () => {
    const blog = {
        title: 'test blog',
        author: 'test author',
        url: 'testurl',
        likes: 1
    }

    const addedBlog = await api.post('/api/blogs').send(blog).expect(201).expect('Content-Type', /application\/json/)
    const allBlogs = await api.get('/api/blogs')

    assert.strictEqual(allBlogs.body.length, 3)
    assert.deepStrictEqual(addedBlog.body, allBlogs.body[2])
})

test('adding a new blog without any likes default the likes to 0', async () => {
    const blog = {
        title: 'test blog with no likes',
        author: 'test',
        url: 'testurl'
    }

    const savedBlog = await api.post('/api/blogs').send(blog)

    assert.strictEqual(savedBlog.body.likes, 0)
})

describe('adding a blog without a title or url results in a bad request', () => {
    test('adding a blog without a title but has a url', async () => {
        const blog = {
            author: 'test',
            url: 'testurl',
            likes: 4
        }

        await api.post('/api/blogs').send(blog).expect(400)
    })

    test('adding a blog without a url but has a title', async () => {
        const blog = {
            author: 'test',
            title: 'test title',
            likes: 4
        }

        await api.post('/api/blogs').send(blog).expect(400)
    })

    test('adding a blog without either a title or url', async () => {
        const blog = {
            author: 'test',
            likes: 4
        }

        await api.post('/api/blogs').send(blog).expect(400)
    })
})

test('deleting a blog deletes it with a 204 response', async () => {
    const allBlogs = await api.get('/api/blogs')
    const blogToDelete = allBlogs.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    const remainingBlogs = await api.get('/api/blogs')
    // console.log(blogToDelete, remainingBlogs.body[0]) // double checking as notDeepStrictEqual would just return true if either objects were undefined
    assert.notDeepStrictEqual(blogToDelete, remainingBlogs.body[0])
})

test('updating a blog updates it in the database', async () => {
    const allBlogs = await api.get('/api/blogs')
    const blogToUpdate = allBlogs.body[0]

    const updatedBlog = {
        title: 'updated test title',
        author: 'updated test author',
        url: 'updated test url'
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
    const updatedBlogs = await api.get('/api/blogs')

    assert.deepStrictEqual({ ...blogToUpdate, ...updatedBlog }, updatedBlogs.body[0]) // decided to experiment with spread operators and this seemed to work
})

after(async () => {
    mongoose.connection.close()
})