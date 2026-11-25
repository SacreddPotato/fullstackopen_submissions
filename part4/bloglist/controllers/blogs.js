const blogRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
    const blog = await Blog.find({}).populate('user')
    return res.json(blog)
})

blogRouter.post('/', userExtractor, async (req, res) => {
    const blog = new Blog({ ...req.body, likes: req.body.likes ?? 0, user: req.user._id })
    await blog.save()
    req.user.blogs = req.user.blogs.concat(blog._id)
    await req.user.save()

    res.status(201).json(blog)
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (blog.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    req.user.blogs = req.user.blogs.filter(bId => bId !== req.params.id)
    await req.user.save()

    res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    blog.title = req.body.title ?? blog.title
    blog.likes = req.body.likes ?? blog.likes
    blog.url = req.body.url ?? blog.url
    blog.author = req.body.author ?? blog.author
    await blog.save()

    res.json(blog)
})

module.exports = blogRouter