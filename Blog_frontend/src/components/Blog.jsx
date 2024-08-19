import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(true);

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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      {showDetails && (
        <div>
          <button onClick={toggleDetails}>hide</button>
          <p>{blog.url}</p>
          <p>likes {blog.likes}</p>
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