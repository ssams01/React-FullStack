import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

const logout = async () => {
    try {
      localStorage.removeItem('token');
  
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
  };
}

export default { login, logout }