import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import { LiaKeySolid } from 'react-icons/lia';
// import { Button } from 'react-bootstrap';

const Notification = ({ message, isError }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timerId);
  }, [message, isError]); // Ensure the effect runs when message or isError changes

  if (message === null) {
    return null;
  }

  if (!visible) {
    return null;
  }

  if (isError) {
    return (
      <div className='yoti'>
        {message}
      </div>
    );
  }

  return (
    <div className='noti'>
      {message}
    </div>
  );
};


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [alertMessage, setAlertMessage] = useState('Hello')
  const [isError, setIsError] = useState(false)
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async(event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setAlertMessage('wrong username or password')
      setIsError(true)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    setUser(null);
  };

 
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {

    blogService
    .create(blogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setAlertMessage(`A new blog ${title} by ${author} added`)
      setIsError(false)
    })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target; 
  
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'author':
        setAuthor(value);
        break;
      case 'url':
        setUrl(value);
        break;
      default:
        console.error('Unexpected input name:', name);
    }
  };

  const loginForm = () => {

    setAlertMessage(
    "Welcome, please Log In"
    )
    return (
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
          type={showPassword 
 ? 'text' : 'password'}
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button type="submit">login</button>
    </form>
    )
    
  }

  const blogForm = () => {
    <Togglable buttonLabel="new blog">
      <BlogForm
        createBlog={addBlog} 
      />
    </Togglable>
  }

  return (
    <div>
      {!user &&
      <div>
      <h2>log in to application</h2>
      <Notification message={alertMessage} isError={isError}/>
      {loginForm()}
      </div>
      }
      {user && <div>
      <h2>blogs</h2>
   
      <p>{user.name} is logged-in</p>
      {/* <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button> */}
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
      }
      
    </div>
  )
}

export default App