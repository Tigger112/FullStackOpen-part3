const mongoose = require("mongoose");

const argv = process.argv

if (argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = argv[2]

const url = `mongodb+srv://tiggerjeo:${password}@phonebookdb.8p0ux.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=phonebookdb`;

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema);

if (argv.length < 4) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const name = argv[3];
  const number = argv[4];

  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close()
  })
}


