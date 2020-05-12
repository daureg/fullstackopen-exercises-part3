const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = persons.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  lines = [
    `<p>Phonebook has info for ${persons.length} people</p>`,
    `<p>${(new Date()).toString()}</p>`
  ]
  res.send(lines.join("\n"))
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
  if (persons.filter(p => p.name.toLowerCase() === body.name.toLowerCase()).length > 0) {
      return res.status(400).json({error: `There is already a person named '${body.name}' in the phone book`})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
