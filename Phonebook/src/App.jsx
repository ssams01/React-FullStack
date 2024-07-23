import { useState, useEffect } from 'react';
import personService from './services/person'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  if(isError) {
    return (
      <div className='yoti'>
        {message}
      </div>
    )
  }
  return (
    <div className='noti'>
      {message}
    </div>
  )
}

const PersonInfo = ({ person, handleDelete }) => {
  return (
    <p>
    {person.name} {person.number} 
    <button onClick={() => handleDelete(person)}>delete</button>
    </p>
  )
};

const FilteredList = ({ items, filterTerm, renderItem }) => {
  const filteredItems = items.filter((item) => {
    const nameRegex = new RegExp(filterTerm, 'i'); 
    return nameRegex.test(item.name); 
  });

  return (
    <div>
      {filteredItems.length > 0 ? (
        <div>
          {filteredItems.map((item, index) => renderItem(item, index))}
        </div>
      ) : filterTerm ? (
        <p>No results found.</p>
      ) : (
        <div>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  );
};

const Filter = ({currFilter, setCurrFilter}) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setCurrFilter(event.target.value);
  };

  return (
    <input
    type="text"
    value={currFilter}
    onChange={handleFilterChange}
    placeholder="Filter by name..."
    />
  )
}

const PersonForm = ({persons, setPersons, updatePerson, setAlertMessage}) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber
    };

    const foundPerson = persons.find((person) => person.name === newPerson.name);

    if (!foundPerson) { 
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson])
        setAlertMessage(`Added ${newPerson.name}`)
      })
    } else {
      updatePerson(foundPerson.id, newPerson.number)
      setAlertMessage(`Updated ${foundPerson.name}'s number`)
    }

    setNewName(''); 
    setNewNumber('')
  };
   
  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input 
      value={newName} 
      onChange={handleNameChange} />
    </div>
    <div>
      number: <input 
      value={newNumber} 
      onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

function App() {
  const [persons, setPersons] = useState([]);
  const [currFilter, setCurrFilter] = useState('')
  const [alertMessage, setAlertMessage] = useState('Welcome')
  const [isError, setIsError] = useState(false)

  const hook = () => {
    console.log('effect')
    personService
    .getAll()
    .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
    })
  }
  useEffect(hook, [])

  const handleDelete = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      try {
        personService.delet(personToDelete.id);
        setPersons(persons.filter((person) => person.id !== personToDelete.id));
      } 
      catch (error) {
        console.error('Error deleting person:', error);
        setIsError(true);
        setAlertMessage(`Information of ${personToDelete.name} has already been removed from server`);
      }
    }
  };

  const updateNumber = (id, newNumber) => {
    const personToUpdate = persons.find(p => p.id === id)
    const changedPerson = {...personToUpdate, number : newNumber}

    if(window.confirm(`${personToUpdate.name} is already added to phonebook,
      replace the old number with a new one?`)) {
        personService
          .update(id, changedPerson)
          .then(returnedPerson => {
             setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
           })
      }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage} isError={isError}/>
      <Filter currFilter={currFilter} setCurrFilter={setCurrFilter}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} updatePerson={updateNumber}
      setAlertMessage={setAlertMessage}
      />
      <h2>Numbers</h2>
      <FilteredList
        items={persons} 
        filterTerm={currFilter} 
        renderItem={(person, index) => ( 
          <PersonInfo key={index} person={person} handleDelete={handleDelete}/>
        )}
      />
    </div>
  );
}

export default App;