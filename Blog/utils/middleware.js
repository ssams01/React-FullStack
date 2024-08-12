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

  const userExtractor = async (req, res, next) => {
    try {
      const token = tokenExtractor(req, res, next);
      if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decodedToken.id);
        req.user = user;
      }
      next();   
  
    } catch (error) {
      console.error(error);   
  
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };

module.exports = {
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}