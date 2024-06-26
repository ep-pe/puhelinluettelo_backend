const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give MongoDB password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://eppe:${password}@eppe.cxh3yhx.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=eppe`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length===3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length<5) {
    console.log('give proper contact details as arguments')
    process.exit(1)
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(() => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}