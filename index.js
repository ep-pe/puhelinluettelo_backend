require('dotenv').config()  // Load environment variables from a .env file into process.env
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('content', function (req) {
    return req.body ? JSON.stringify(req.body) : 'no-content'
})

const morgan_format = ':method :url :status :res[content-length] - :response-time ms :content'

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(morgan_format))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
    // Count the number of documents in the collection
    Person.countDocuments()
        .then(count => {
            response.send(`<div>Phonebook has info for ${count} people</div><br/><div>${Date()}</div>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            response.json(deletedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    Person.find({ name: body.name })
        .then(res => {
            if (res.length > 0) {
                return response.status(400).json({
                    error: 'name must be unique'
                })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })
                person.save().then(savedPerson => {
                    response.json(savedPerson)
                }).catch(error => next(error))
            }
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})