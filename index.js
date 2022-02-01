const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  person ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => Math.ceil(Math.random() * 5000);

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) return response.status(400).json({ error: 'name missing' });

  if (!body.number)
    return response.status(400).json({ error: 'number missing' });

  // Check if person exists in phonebook already
  const personFound = persons.some((person) => person.name === body.name);

  if (personFound)
    return response.status(400).json({
      error: `${body.name} already exists in the phonebook, name must be unique`,
    });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/info', (request, response) => {
  date = new Date();

  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
