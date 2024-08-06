const Blog = require("../models/blog")

const initialBlogs = [
    {
        _id: '66ad050432b024eale14d78',
        title: "A titel",
        author: "a author",
        url: "someperson.com",
        likes: 7777,
        __v: 0

    }
]

const nonExistingId = async () => {
    const blog = new Blog({ author: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blogs.toJSON())
  }

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}