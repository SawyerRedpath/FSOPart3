require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const person = Person.findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name) return response.status(400).json({ error: 'name missing' });

  if (!body.number)
    return response.status(400).json({ error: 'number missing' });

  // Check if person exists in phonebook already
  // const personFound = persons.some((person) => person.name === body.name);

  // if (personFound)
  //   return response.status(400).json({
  //     error: `${body.name} already exists in the phonebook, name must be unique`,
  //   });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  date = new Date();

  Person.find({})
    .then((persons) => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
