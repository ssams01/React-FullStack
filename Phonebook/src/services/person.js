import axios from 'axios'
import { jsx } from 'react/jsx-runtime'

const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    console.log(axios.get(baseUrl))
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const delet = (id) => {
    const response = axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}



export default {
    getAll,
    create,
    delet,
    update
}