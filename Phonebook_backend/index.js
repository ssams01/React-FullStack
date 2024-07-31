const express = require('express')
var morgan = require('morgan')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(morgan('tiny'))
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

//uncomment and use the formatted morgan code if you ever connect this small app to a 
//db where POST requests will actually work

// morgan.token('json', (req, res) => {
//     if (req.method === 'POST') {
//       return ` { ${JSON.stringify(req.body)} }`;
//     } else {
//       return '';
//     }
//   });
  
//   // Use the custom format
//   const format = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms :json';
  
//   app.use(morgan(format));

  let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2", 
        "name": "Ada Lovelance",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'   
   };
    return date.toLocaleString('en-US', options);
  }
  
  const now = new Date();
  const formattedDate = formatDate(now);

app.get('/', (request,response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(persons => {
        // persons.forEach(person => response.json(person))
        response.json(persons)
        console.log(response.json(persons))
    })
})

app.get('/api/persons/:id', (request,response) => {
    // const id = request.params.id
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    // }
    // else {
    //     console.log('x')
    //     response.status(404).end()    
    // }
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})


const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0

    return String(maxId + 1)

}
 
app.post('/api/persons/', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    else if(!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(),
    })

    // persons = persons.concat(person)

    // response.json(person)
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

//do app.put here ! look to frontend and gemini to help you !
app.put('/api/persons/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const updatedPerson = await Person.findByIdAndUpdate(id, body, { new: true });
    response.json(updatedPerson)
})

//In theory, this works but test once you get put implemented also
app.delete('/api/persons/:id', async (request, response) => {
    const id = request.params.id;

    try {
        const result = await Person.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Person not found' });
        }

        response.status(204).end();
    } catch (error) {
        console.error('Error deleting person:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${formattedDate}</p>`)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})