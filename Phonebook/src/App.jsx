import { useState, useEffect } from 'react';
import axios from 'axios'


const PersonInfo = ({ person }) => {
  return (
    <p>
    {person.name} {person.number}
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

const PersonForm = ({persons, setPersons}) => {
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
      setPersons([...persons, newPerson]);
    } else {
      alert(`${foundPerson.name} is already added to the phonebook`);
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

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter currFilter={currFilter} setCurrFilter={setCurrFilter}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <FilteredList
        items={persons} 
        filterTerm={currFilter} 
        renderItem={(person, index) => ( 
          <PersonInfo key={index} person={person} />
        )}
      />
    </div>
  );
}

export default App;