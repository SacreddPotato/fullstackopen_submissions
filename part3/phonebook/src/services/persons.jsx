import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => axios.get(`${baseUrl}`).then(res => res.data)

const putPerson = (person) => axios.post(`${baseUrl}`, person).then(res => res.data)

const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`).then(res => res.data)

const updateNumber = (id, person) => axios.put(`${baseUrl}/${id}`, person).then(res => res.data)

export default {getAll, putPerson, deletePerson, updateNumber}