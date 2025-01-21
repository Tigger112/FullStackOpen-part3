const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("json", (request, respones) => {
  const body = request.body;
  if (request.method === "POST") {
    return JSON.stringify(body);
  }
  return " ";
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);

app.get("/info", (request, response) => {
  const message = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
    `;

  response.send(message);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, respones) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  respones.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 99999));
};

app.post("/api/persons", (request, respones) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return respones.status(400).json({ error: "name or number is missing" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return respones.status(400).json({ error: "name must be unique" });
  }

  if (persons.find((person) => person.number === body.number)) {
    return respones.status(400).json({ error: "number must be unique" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  respones.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("start");
});
