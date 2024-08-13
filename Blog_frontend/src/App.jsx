import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { Button } from 'react-bootstrap';

const App = () => {
  const [blogs, setBlogs] = useState([])
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
    event.preventDefault()

    console.log('post blog clicked', event.target)
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
    .create(blogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
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
    return (
      <form onSubmit={addBlog}>
        title:
        <input
         type="text"
         name="title"
         value={title}
         onChange={handleBlogChange} 
        />
        <br />
        author:
        <input
         type="text"
         name="author"
         value={author}
         onChange={handleBlogChange} 
        />
        <br />
        url:
        <input
         type="text"
         name="url"
         value={url}
         onChange={handleBlogChange} 
        />
        <br />
        <button type="submit">create</button>
      </form>
    )
  }

  return (
    <div>
      {!user &&
      <div>
      <h2>log in to application</h2>
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