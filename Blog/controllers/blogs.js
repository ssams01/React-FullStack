const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
     const blogs = await Blog.find({})
     response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    // const blog = new Blog(request.body)
  
    // const savedBlog = await blog.save()
    // response.status(201).json(savedBlog)
    const { likes, ...otherData } = request.body;

    if (likes === undefined) {
      request.body.likes = 0;
    }

    const blog = new Blog({ ...otherData, likes });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
})

  module.exports = blogsRouter