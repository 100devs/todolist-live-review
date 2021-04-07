//Loading Packages
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 2121;
require('dotenv').config();

//Set the MongoDB Database
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'todo';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    db = client.db(dbName);
  })
  .catch((err) => {
    console.log(err);
  });

//Set the server
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//route
//GET - @home
app.get('/', async (req, res) => {
  const todoItems = await db.collection('todos').find().toArray();
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  res.render('index.ejs', { zebra: todoItems, left: itemsLeft });
});

//route
//POST - @Create Todo Item
app.post('/createTodo', (req, res) => {
  db.collection('todos')
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log('Todo has been added!');
      res.redirect('/');
    });
});

//route
//PUT - @markComplete (from fetch - main.js)
app.put('/markComplete', (req, res) => {
  db.collection('todos')
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      res.json('Marked Complete');
    });
});

//route
//PUT - @undo (from fetch - main.js)
app.put('/undo', (req, res) => {
  db.collection('todos')
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: false,
        },
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      res.json('Marked Complete');
    });
});

//route
//DELETE - @deleteTodo (from fetch - main.js)
app.delete('/deleteTodo', (req, res) => {
  db.collection('todos')
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log('Deleted Todo');
      res.json('Deleted It');
    })
    .catch((err) => console.log(err));
});

//Start the server
app.listen(process.env.PORT || PORT, () => {
  console.log('Server is running, you better catch it!');
});
