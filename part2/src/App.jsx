import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './Note'
import noteService from './services/notes'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async(event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
   

 useEffect(() => {
    noteService
       .getAll()
       .then(initialNotes => {
        setNotes(initialNotes)
       })
 }, [])

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }

    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
    
    noteService
      .update(id, changedNote) 
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // Only set error message if update truly failed
        if (error.response && error.response.status === 404) {
          setErrorMessage(
            `Note '${note.content}' was already removed from server`
          )
          setNotes(notes.filter(n => n.id !== id)) // Still remove from local state on error
        } else {
          // Handle other potential errors here (e.g., network issues)
          console.error('Error updating note:', error)
        }
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll 
      ? notes
      : notes.filter(note => note.important)

  const loginForm = () => {
    <form onSubmit={handleLogin}>
      <div>
        username
         <input
         type="text"
         value={username}
         name="Username"
         onChange = {({ target }) => setUsername(target.value)}
         />
      </div>
      <div>
        password
         <input
         type="password"
         value={password}
         name="Password"
         onChange = {({ target }) => setPassword(target.value)}
         />
      </div>
      <button type="submit">login</button>
    </form>
  }

  const noteForm = () => {
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange} 
      />
      <button type="submit">save</button>
    </form>
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
    }
      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all'}
        </button> 
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App