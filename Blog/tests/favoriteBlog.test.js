const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite Blog', () => {
      const listWithMultipleBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        },
        {
            _id: '5a422aa71b54a679994d17f8',
            title: '1984',
            author: 'George Orwell',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Orwell1984.pdf',
            likes: 29,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676236r37f8',
            title: 'Harry Potter and the Sorcerers Stone',
            author: 'J.K. Rowling',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/RowlingHPSS.pdf',
            likes: 45,
            __v: 0
          }
      ]

    test('the blog with the most likes was correctly returned', () => {
      const expectedBlog = {
        _id: '5a422aa71b54a676236r37f8', // Replace with the expected _id
        title: 'Harry Potter and the Sorcerers Stone',
        author: 'J.K. Rowling',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/RowlingHPSS.pdf',
        likes: 45,
        __v:0
      };
  
      const result = listHelper.favoriteBlog(listWithMultipleBlog);
  
      assert.deepStrictEqual(result, expectedBlog);
    })
})