const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give a password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://stephensams:${password}@cluster0.huswtmz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


//Defining the schema for our database
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

//defining the singular name of our model with param[0]
const Person = mongoose.model('Person', personSchema)

function retrieveEntries() {
    try {
      mongoose.connect(url);

      console.log("phonebook:")
      Person.find({}).then(result => {
        result.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close();
      })
    } catch (error) {
      console.error(error);
    }
  }

if(process.argv.length === 3) {
    retrieveEntries()
}
else {
const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})

}
