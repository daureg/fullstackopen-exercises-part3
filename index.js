require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => { res.json(person) })
    .catch(error => {console.error(error); res.status(404).end()})
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  Person.estimatedDocumentCount()
    .then(num_people => {
      lines = [
        `<p>Phonebook has info for ${num_people} people</p>`,
        `<p>${(new Date()).toString()}</p>`
      ]
      res.send(lines.join("\n"))
    })
    .catch(error => {console.error(error); response.status(404).end()})
})

const generateId = () => Math.floor(Math.random() * Math.floor(4000000000))

app.post('/api/persons', (req, res) => {
  console.debug(req, req.body);
  const body = req.body

  for (const field of ["name", "number"]) {
    if (!body[field]) {
      return res.status(400).json({error: `You must provide a '${field}' for that person`})
    }
  }
  /*
  if (persons.filter(p => p.name.toLowerCase() === body.name.toLowerCase()).length > 0) {
      return res.status(400).json({error: `There is already a person named '${body.name}' in the phone book`})
  }
  */

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => { res.json(savedPerson) })
    .catch(error => {console.error(error); response.status(404).end()})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
