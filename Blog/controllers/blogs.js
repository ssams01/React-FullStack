const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//if need be add the token extractor back here
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
     console.log('getting blog')
     const blogs = await Blog
     .find({}).populate('user', { username: 1, name: 1})
     console.log('getting blog 2', blogs)
     response.json(blogs) 
})
  
blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  }
  else {
    response.status(404).end()
  }
})

//running into a Unauthorized when trying to run a post request to make a blog 
// may need to for now, take out the likes and title validation stuff and just have it create
//the blog bar for bar like the notes but with the fields from the Blog Schema
blogsRouter.post('/', async (request, response) => {
  const { likes, title, url, author} = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid ' });
  }

  try {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(400).json({ error: 'User not found' }); // Handle user not found
    }

    if (likes === undefined) {
      request.body.likes = 0;
    }
    if (title === undefined || url === undefined) {
      return response.status(400).json({ message: 'Bad request: Missing required fields "title" and/or "url".' });
    } else {
      const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user._id
      })
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id); 
      await user.save(); 
      response.status(201).json(savedBlog);
    }
  } catch (error) {
    console.error('Error saving blog:', error);
    response.status(500).json({ error: 'Internal server error' }); // Generic error for client
  }
});


//may need to refactor a little later to incorporate async/await
//like the other routes
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new : true})
      .then((updatedBlog => {
        response.json(updatedBlog)
      }))
      .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user; 

  if (!user) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const blog = await Blog.findById(request.params.id).populate('user');

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found'   
 });
  }

  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({   
    error: 'Only the blog creator can delete it!' });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();  
    
})

  module.exports = blogsRouter