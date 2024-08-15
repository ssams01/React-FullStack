const BlogForm = ({ createBlog }) => {
    const {title, setTitle} = useState('')
    const {author, setAuthor} = useState('')
    const {url, setUrl} = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <form onSubmit={addBlog}>
          title:
          <input
           type="text"
           name="title"
           value={title}
           onChange={handleBlogChange} 
          />
          <br />
          author:
          <input
           type="text"
           name="author"
           value={author}
           onChange={handleBlogChange} 
          />
          <br />
          url:
          <input
           type="text"
           name="url"
           value={url}
           onChange={handleBlogChange} 
          />
          <br />
          <button type="submit">create</button>
        </form>
      )
}

export default BlogForm