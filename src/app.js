const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Validates if the repository ID is a valid one
function validateRepoId(request, response, next) {
  const { id } = request.params;

  if (isUuid(id)) {
    return next();
  } 
  else {
    return response.status(400).json({ error: 'Invalid Repository Id.'});
  }
};

app.use('/repositories/:id', validateRepoId);

// Gets the list of repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories); 
});

// Creates a new repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  // All fields are required
  if (!title || !url || !techs) {
    return response.status(400).json({ error: 'All parameters are required, please verify.' });
  }

  const likes = 0;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes };

    repositories.push(repository);

    return response.json(repository);
});

// Updates a repository
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  // if (!id || !title || !url || !techs) {
  //   return response.status(400).json({ error: 'All parameters are required, please verify.' });
  // }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex >= 0) {
    
    const { 
      title: currTitle, 
      url: currUrl, 
      techs: currTechs, 
      likes: currLikes 
    } = repositories[repositoryIndex];
    
    newTitle = title ? title : currTitle;

    newUrl = url ? url : currUrl;

    newTechs = techs ? techs : currTechs;
    
    const newRepository = { 
      id,
      title: newTitle,
      url: newUrl,
      techs: newTechs,
      likes: currLikes
      //likes: repositories[repositoryIndex].likes
    }

    repositories[repositoryIndex] = newRepository;
    
    return response.json(newRepository);
    //return response.json(repositories[repositoryIndex]);
  } 
  else {
    return response.status(400).json({ error: 'Repository not found' });
  }
});

app.put("/repositories", (request, response) => {
  return response.status(400).json({ error: 'The repository ID is required' });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  console.log(repositoryIndex);

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);

    return response.status(204).send(); 
  } 
  else {
    return response.status(400).json({ error: 'Repository not found.' });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { query_url } = request.url;
  console.log(id);

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex >= 0) {    
    const { 
      id,
      title,
      url,
      techs
    } = repositories[repositoryIndex];

    let { likes } =  repositories[repositoryIndex];

    likes++;

    const repository = { 
      id,
      title,
      url,
      techs,
      likes
    }

    repositories[repositoryIndex] = repository;

    return response.json(repository);
  } 
  else {
    return response.status(400).json({ error: 'Repository not found' });
  }
});

module.exports = app;
