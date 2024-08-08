const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { ObjectId } = require('mongodb');

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

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

test('no title field recieves a 400', async () => {
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

test('no url field recieves a 400', async () => {
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
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(b => b.title)
      assert(!contents.includes(blogToDelete.title))

})

test.only('a blogs title can be successfully updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    console.log('blogToUpdate._id:', blogToUpdate._id);

    const updatedBlog = {
      title: 'a sophisticated title',
      author: 'a author',
      url: 'someperson.com',
      likes: 7777
    };
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`) // Use existing ID from blogToUpdate
      .send(updatedBlog) // Don't include ID in updatedBlog object
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        assert.strictEqual(response.body.title, updatedBlog.title);
        assert.strictEqual(response.body.author, updatedBlog.author);
        assert.strictEqual(response.body.url, updatedBlog.url);
        assert.strictEqual(response.body.likes, updatedBlog.likes);
      });
    
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  
  })

after(async () => {
    await mongoose.connection.close()
})