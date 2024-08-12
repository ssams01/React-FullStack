const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
     const blogs = await Blog
     .find({}).populate('user', { username: 1, name: 1})
     response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
  const { likes, title, url, ...otherData } = request.body;

  // Assuming the userExtractor middleware is already used

  if (!request.user) { // Check if user is present on the request object
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const user = request.user; // Access the user from middleware

  if (likes === undefined) {
    request.body.likes = 0;
  }
  if (title === undefined || url === undefined) {
    return response.status(400).json({ message: 'Bad request: Missing required fields "title" and/or "url".' });
  } else {
    const blog = new Blog({ ...otherData, likes, user: user._id }); // Use user._id from request.user

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); // Update user's blogs array (implementation depends on your model)
    await user.save(); // Save the updated user with the new blog ID (optional, depending on your model)
    response.status(201).json(savedBlog);
  }
})


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