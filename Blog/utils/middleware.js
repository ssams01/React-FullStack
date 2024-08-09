const logger = require('./logger')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    next()
  }

  const userExtractor = async (request, response, next) => {
    const token = tokenExtractor(request, response, next);
  
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decodedToken.id); 
  
        if (user) {
          request.user = user; 
        }
      } catch (error) {
         console.error(error);
         return response.status(401).json({ error: 'Unauthorized' });
      }
    }
  
    next();
  };

module.exports = {
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}