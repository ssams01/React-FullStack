import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [currFilter, setCurrFilter] = useState('')

  useEffect(() => {
        axios.get('http://localhost:3001/countries')
        .then(response => {
          setCountries(response.data);
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        })
    });

    const handleFilterChange = (event) => {
      setCurrFilter(event.target.value)
    }

    const filteredCountries = countries.filter(country => {
      const regex = new RegExp(currFilter, 'i')
      return regex.test(country.name.common)
    })

  return (
    <div>
      find countries 
      <input 
         type="text" 
         value={currFilter} 
         onChange={handleFilterChange} />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        <ul>
          {filteredCountries
            .map((country) => (
            <li key={country.ccn3}>{country.name.common}</li>
          ))}
        </ul>
      )}
    </div>
  );

}

export default App;