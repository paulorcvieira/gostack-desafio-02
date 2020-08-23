const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.status(200).json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  if (!title && !url && !techs) {
    return res.status(400).json({ error: 'Fields not match!' });
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return res.status(200).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found!' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return res.status(200).json(repository)

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return res.status(400).json({ error: 'Repository not found!' })
  }

  return res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found!' })
  }

  const repository = repositories[repositoryIndex];

  const result = repository.likes + 1;

  repository.likes = result;

  return res.status(200).json(repository);
});

module.exports = app;
