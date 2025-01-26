const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const app = express();
app.use(express.json());
app.use(cors());

morgan.token("json", (request, respones) => {
  const body = request.body;
  if (request.method === "POST") {
    return JSON.stringify(body);
  }
  return " ";
});

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

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, respones, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      respones.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, respones, next) => {
  const id = request.params.id;
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      respones.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, respones, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return next({ name: "name or number is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    respones.json(savedPerson);
  });
});

const unknownEndpoint = (request, respones) => {
  respones.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, respones, next) => {
  console.log(error.name);

  switch (error.name) {
    case "CastError":
      return respones.status(400).send({ error: "malfromatted id" });
    case "name or number is missing":
      return respones.status(400).send({ error: error.name });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("start");
});
