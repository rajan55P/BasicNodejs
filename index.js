const express = require('express');
const app = express();
const port = 3031;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('TODO List API');
// });
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  });
  
app.get('/script.js', (req, res) => {
    res.sendFile('script.js', { root: __dirname });
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const Datastore = require('nedb');
const db = new Datastore({ filename: 'todos.db', autoload: true });

// Error handling for the database
db.on('error', function (err) {
  console.error('Database error:', err);
});

// Create an index on the "createdAt" field for faster querying
db.ensureIndex({ fieldName: 'createdAt' }, function (err) {
  if (err) {
    console.error('Error creating index:', err);
  }
});

// GET all TODOs
app.get('/todos', (req, res) => {
  db.find({}, (err, todos) => {
    if (err) {
      console.error('Error finding todos:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(todos);
    }
  });
});

// POST a new TODO
app.post('/todos', (req, res) => {
  const todo = {
    text: req.body.text,
    createdAt: new Date().toISOString(),
  };

  db.insert(todo, (err, newTodo) => {
    if (err) {
      console.error('Error creating todo:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json(newTodo);
    }
  });
});

// DELETE a TODO by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  db.remove({ _id: todoId }, {}, (err, numRemoved) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (numRemoved === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.sendStatus(204);
    }
  });
});
