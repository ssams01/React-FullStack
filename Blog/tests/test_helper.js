const Blog = require("../models/blog")

const initialBlogs = [
    {
        _id: '66ad050432b024eale14d78',
        title: "A titel",
        author: "a author",
        url: "someperson.com",
        likes: 7777,
        __v: 0

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

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}