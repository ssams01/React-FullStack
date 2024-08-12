const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware'); 

//if need be add the token extractor back here

blogsRouter.get('/', async (request, response) => {
     console.log('getting blog')
     const blogs = await Blog
     .find({}).populate('user', { username: 1, name: 1})
     console.log('getting blog 2', blogs)
     response.json(blogs) 
})
  

//running into a Unauthorized when trying to run a post request to make a blog 
// may need to for now, take out the likes and title validation stuff and just have it create
//the blog bar for bar like the notes but with the fields from the Blog Schema
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { likes, title, url, ...otherData } = request.body;

  

  if (!request.user) { 
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const user = request.user; 

  if (likes === undefined) {
    request.body.likes = 0;
  }
  if (title === undefined || url === undefined) {
    return response.status(400).json({ message: 'Bad request: Missing required fields "title" and/or "url".' });
  } else {
    const blog = new Blog({ ...otherData, likes, user: user._id }); 

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); 
    await user.save(); 
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