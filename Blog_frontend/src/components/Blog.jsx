import React, { useState } from 'react';
//import blogService from './services/blogs

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLikes = async () => {
    const updatedBlog = {...blog, likes: likes + 1}

    try {
      const returnedBlog = await blogService.update(updatedBlog)
      setLikes(returnedBlog.likes)
    }
    catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      {showDetails && (
        <div>
          <button onClick={toggleDetails}>hide</button>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={handleLikes}>like</button></p>
        </div>
      )}
      {!showDetails && (
        <div>
          <button onClick={toggleDetails}>view</button>
        </div>
      )}
    </div>
  );
};

export default Blog;