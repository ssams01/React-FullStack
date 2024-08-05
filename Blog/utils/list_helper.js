const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  };

const favoriteBlog = (blogs) => {
    let currHighestLikes = 0;
    let blogWithHighestLikes;
  
    blogs.forEach((blog) => { 
      if (blog.likes > currHighestLikes) {
        currHighestLikes = blog.likes;
        blogWithHighestLikes = blog;
      }
    });
  
    return blogWithHighestLikes;

}

//create method to return the author with the most blogs and the number of blogs (optional for now)

//create a method to return the author with the most likes and the amount (pressumably you will need to use some of the logic from the previous 
//method  in order to find all the authors blogs and then create a new array with the author and there likes corresponding -- again was told it is a optional one that 
//doesn't impact the course progression, and it is advised to come back after you complete the other parts to the current part)

module.exports = {
    dummy, totalLikes, favoriteBlog
}

