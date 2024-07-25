const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(morgan('tiny'))
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
    response.json(persons)
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
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        console.log('x')
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id === id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${formattedDate}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})