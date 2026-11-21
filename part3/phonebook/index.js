const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const ErrorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => 
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
))
const PORT = 3001

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const date = Date()

  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.find({testId: req.params.id}).then(p => {
    if (p) {
      return res.json(p)
    } 
    return res.status(404).end()
  }).catch(err => next(err)) 
})

app.delete('/api/persons/:id', (req, res, next) => {
  console.log(req)
  Person.findOneAndDelete({testId: req.params.id}).then(() => {
    return res.status(204).end()
  }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body
  const id = Math.floor(Math.random() * 1000)

  // if (!person.name) {
  //     return res.status(400).json({error: "empty content"})
  // }

  // if (persons.find(p => p.name === req.body.name)) {
  //     return res.status(400).json({error: "name must be unique"})
  // }

  const newPerson = {
    name: person.name,
    number: person.number,
    testId: id
  }

  Person.create(newPerson).then(savedPerson => {
    res.json(savedPerson)
  }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findOne({testId: req.params.id}).then(person => {
    person.number = req.body.number

    return person.save().then(updatedPerson => {
      res.json(updatedPerson)
    }) // Since we're using save() then validation will be triggered automatically as we're not using an update() method
  }).catch(err => next(err))
})

app.use(ErrorHandler)

app.listen(PORT, () => console.log(`App is running on port ${PORT}`))