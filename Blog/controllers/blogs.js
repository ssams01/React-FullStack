const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
     const blogs = await Blog
     .find({}).populate('user', { username: 1, name: 1})
     response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const { likes, title, url, ...otherData } = request.body;
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)
    console.log(user)

    if (likes === undefined) {
      request.body.likes = 0;
    }
    if(title === undefined || url === undefined) {
      return response.status(400).json({ message: 'Bad request: Missing required fields "title" and/or "url".' });
    }
    else {

      //if this causes an error while testing, you may need to
      //find a way to replace "otherData" because of how blogs now have
      //a reference to the user in them ??
      const blog = new Blog({ ...otherData, likes, user: user._id });

      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id)
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
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

  module.exports = blogsRouter