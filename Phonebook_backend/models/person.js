const mongoose = require('mongoose')

const url = process.env.MONGO_URI
console.log(url)

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const customValidator = (value) => {
    const regex = /^[a-zA-Z]{2,3}-[0-9]+$/;
    return regex.test(value);
  };

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: customValidator,
        message: 'Invalid format. Expected format: AAA-123 or AA-123'
      }
    }

})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)