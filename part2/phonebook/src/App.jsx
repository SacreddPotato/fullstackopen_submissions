import { useState, useEffect } from 'react'
import personService from './services/persons'

const addedPersonStyle = {
  color: "Green",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px"
}

const alterPersonStyle = {
  color: "Yellow",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px"
}

const errorStyle = {
  color: "Red",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px"
}

const AddedPersonNotification = ({ message }) => {
  return <div style={addedPersonStyle}>
      <p>{message}</p>
    </div>
}

const AlterPersonNotification = ({ message }) => {
  return <div style={alterPersonStyle}>
      <p>{message}</p>
    </div>
}

const ErrorNotification = ({ message }) => {
  return <div style={errorStyle}>
      <p>{message}</p>
    </div>
}

const Filter = ({ value, onChange }) => {
  return <>
    <p>filter shown with <input value={value} onChange={onChange}/></p>
  </>
}

const PersonForm = ({ onFormSubmit, name, onNameChange, number, onNumberChange }) => {
  return <>
  <form onSubmit={onFormSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} />
        <br />
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
}

const Persons = ({ filter, persons, onDelete }) => {
  return <>{filter ? 
    (persons.filter(person => person.name.toLocaleLowerCase().includes(filter))
            .map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => onDelete(person.id)}>Delete</button></p>)) :
      persons.map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => onDelete(person.id)}>Delete</button></p>)}</>

}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addPersonNotification, setAddNotification] = useState(null)
  const [alterPersonNotification, setAlterNotification] = useState(null)
  const [error, setError] = useState(null)

  const handleNameInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleAdd = (event) => {
    event.preventDefault()
    const updatedPerson = persons.find(p => p.name === newName)
    if (updatedPerson) {
      const bool = window.confirm(`${updatedPerson.name} is already added to the phonebook, replace the old number with the new one ?`)
      if (bool) {
        const newPerson = {...updatedPerson, number: newNumber}
        personService.updateNumber(newPerson.id, newPerson).then(p => {
          setPersons(persons.map(person => person.id !== p.id ? person : p))
          setNewName('')
          setNewNumber('')
          setAlterNotification(`${newPerson.name}'s number has been changed.`)
          setTimeout(() => {
            setAlterNotification(null)
          }, 5000)
        })
      }

      return
    }
   
    const newPerson = {name: newName, number: newNumber}
    console.log(newPerson)
    personService.putPerson(newPerson).then(res => {
      setPersons(persons.concat(res))
      setNewName('')
      setNewNumber('')
      setAddNotification(`${newPerson.name} has been added to the phonebook`)
      setTimeout(() => {
        setAddNotification(null)
      }, 5000)
    })
  }
  
  const handleDelete = (id) => {
    console.log(id)
    const bool = window.confirm(`Are you sure you want to delete ${persons.find(p => p.id === id).name} ?`)
    if (bool) {
      personService.deletePerson(id).catch(() => {
        setError(`Information of ${persons.find(p => p.id == id).name} has already been deleted`)
        setTimeout(() => {
          setError(null)
        }, 5000)
      })
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  const handeFilterChange = (event) => {
    setFilter(event.target.value)
  }


  useEffect(() => {
    personService.getAll().then(persons => setPersons(persons))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      {addPersonNotification ? <AddedPersonNotification message={addPersonNotification} />: <></>}
      {alterPersonNotification ? <AlterPersonNotification message={alterPersonNotification} />: <></>}
      {error ? <ErrorNotification message={error} />: <></>}
      <Filter filter={filter} onChange={handeFilterChange} />
      <h2>add a new</h2>
      <PersonForm onFormSubmit={handleAdd} name={newName} number={newNumber} onNameChange={handleNameInputChange} onNumberChange={handleNumberInputChange} />
      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} onDelete={handleDelete} />
    </div>
  )
}

export default App