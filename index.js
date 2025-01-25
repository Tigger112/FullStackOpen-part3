const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const app = express();
// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

morgan.token("json", (request, respones) => {
  const body = request.body;
  if (request.method === "POST") {
    return JSON.stringify(body);
  }
  return " ";
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);
app.use(express.static("dist"));

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    const message = `
      <p>Phonebook has info for ${result.length} people</p>
      <p>${Date()}</p>
      `;
    response.send(message);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      response.status(404).end();
    });
});

app.delete("/api/persons/:id", (request, respones) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  respones.status(204).end();
});

app.post("/api/persons", (request, respones) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return respones.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    respones.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("start");
});
