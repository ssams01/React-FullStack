const logger = require('./logger')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique'})
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token validation' })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

// const tokenExtractor = (request, response, next) => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return { error: 'Unauthorized' };
//   }

//   const userExtractor = async (req, res, next) => {
//     console.log("got here")
//     try {
//       const token = tokenExtractor(req, res, next);
//       console.log("made it past token gettin: ", token)
//       if (token) {
//         const decodedToken = jwt.verify(token, process.env.SECRET);
//         console.log("decoded token: ", decodedToken.id)
//         const user = await User.findById(decodedToken.id);
//         console.log(user)
//         req.user = user;
//       }
//       next();   
  
//     } catch (error) {
//       console.error(error);   
  
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//   };

module.exports = {
    unknownEndpoint,
    requestLogger,
    errorHandler
    // tokenExtractor,
    // userExtractor
}