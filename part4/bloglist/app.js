const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

const app = express()

logger.info('connecting to', config.DB_URI)

mongoose.connect(config.DB_URI, { family: 4 })
    .then(() => logger.info('connected to db'))
    .catch((error) => logger.error('error connecting to db:', error.message))

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(express.static('dist'))

app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app