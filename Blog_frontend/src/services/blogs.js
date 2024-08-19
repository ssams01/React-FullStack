import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  // const config = {
  //   headers: {
  //     'Authorization': token // JWT token should be prefixed with "Bearer "
  //   }
  // };
  
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: {Authorization: token},
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token},
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const delet = (id) => {
  const config = {
    headers: { Authorization: token},
  }

  const response = axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { 
    getAll: getAll,
    create: create,
    update: update,
    delet: delet,
    setToken: setToken
 }      