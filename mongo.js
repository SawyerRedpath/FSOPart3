const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>',
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mongoboi321:${password}@cluster0.omqr6.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 5) {
  console.log('phonebook:');
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(`${person.name} ${person.number}`));

    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(
      `added ${result.name} with the number ${result.number} to phonebook`,
    );
    mongoose.connection.close();
  });
}
