
const express = require('express')
// const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const Note = require('./models/note')

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

const password = process.argv[2]

// const url = process.env.MONGODB_URI;

// mongoose.set('strictQuery', false)

// mongoose.connect(url)


//Defining the schema for our database
// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean,
// })

//formatting the objects returned by Mongoose
// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

//defining the singular name of our model with param[0]

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.use(express.json())

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type' : 'application/json'})
//     response.end(JSON.stringify(notes))z
// })


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.get('/', (request,response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if(body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0

    return String(maxId + 1)

}

// app.get('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const note = notes.find(note => note.id === id)
//     if (note) {
//       response.json(note)
//     } else {
//       console.log('x')
//       response.status(404).end()
//     }
//   })

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})