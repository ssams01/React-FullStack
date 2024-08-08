const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
    {
        title: "A titel",
        author: "a author",
        url: "someperson.com",
        likes: 7777,
    },
    // {
    //   title: "Something Interesting",
    //   author: "Thea B'est",
    //   url: "www.fakeblogs.com/blogs/23432423432",
    //   likes: 537
    // }
    
]

const nonExistingId = async () => {
    const blog = new Blog({ author: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}