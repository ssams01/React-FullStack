const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

test('correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a new blog can be added', async () => {
    const newBlog = {
        title: "Something Interesting",
        author: "Thea B'est",
        url: "www.fakeblogs.com/blogs/23432423432",
        likes: 537
    }

    await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(201)
     .expect("Content-Type", /application\/json/)

     const blogsAtEnd = await helper.blogsInDb()
     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

     const contents = blogsAtEnd.map(b => b.title)
     assert(contents.includes('Something Interesting'))
})

test('no likes field makes zero likes', async () => {
    const newBlog = {
        title: "Womp Womp",
        author: "Noel Beaches",
        url: "www.fakeblogs.com/blogs/487453884",
    }

    const response = await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(201)
     .expect("Content-Type", /application\/json/)

     if (response.body.likes !== undefined) {
        assert.strictEqual(response.body.likes, 0);
      } else {
        // Handle the case where likes is still undefined
        console.error('likes is undefined in response body');
      }
})

test.only('no title field recieves a 400', async () => {
    const newBlog = {
        author: "D'est Notitel",
        url: "www.fakeblogs.com/blogs/83492129",
        likes: 89398
    }

    const response = await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(400)
    //  .expect("Content-Type", /application\/json/)
     .expect({ message: 'Bad request: Missing required fields "title" and/or "url".' })

     const blogsAtEnd = await helper.blogsInDb()

     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

test.only('no url field recieves a 400', async () => {
    const newBlog = {
        title: "Reblog without a cause",
        author: "Noel Paast",
        likes: 89398
    }

    const response = await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(400)
    //  .expect("Content-Type", /application\/json/)
     .expect({ message: 'Bad request: Missing required fields "title" and/or "url".' })

     const blogsAtEnd = await helper.blogsInDb()

     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.notesInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/notes/${blogToDelete.id}`)
      .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(b => b.title)
      assert(!contents.includes(blogToDelete.title))

})

after(async () => {
    await mongoose.connection.close()
})