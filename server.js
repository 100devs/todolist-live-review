const express = require('express'); //calls on express.js
const app = express(); //assigns the returned express function to a variable
const MongoClient = require('mongodb').MongoClient; //retrieves MongoClient class, connects to database
const PORT = 2121; //assigned port when environment port not available
require('dotenv').config(); // Updates environment variable

let db, //variable holds entire connected database
  dbConnectionStr = process.env.DB_STRING, //calls mongodb connection string found inside the .env file
  dbName = 'todo'; //name of database

//links to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    //returns a promise
    console.log(`Hey, connected to ${dbName} database`); //console logs our db to ensure we are connected to db
    db = client.db(dbName); //connection to the database
  })
  .catch((err) => {
    console.log(err); //catches errors from promise in accessing the db
  });

//middleware, goes before routes
app.set('view engine', 'ejs'); //using ejs as templating language
app.use(express.static('public')); //static files found in public folder
app.use(express.urlencoded({ extended: true })); //looks inside request for important data
app.use(express.json()); //tells server to accept the JSON data being sent

//routes below this line
//route of read request && the callback function
app.get('/', async (req, res) => {
  const todoItems = await db.collection('todos').find().toArray(); //find() gets documents stored in db & toArray() creates an array of them
  const itemsLeft = await db
    .collection('todos') //specific todo collection inside database
    .countDocuments({ completed: false }); //counts how many documents have the property of completed: false
  res.render('index.ejs', { zebra: todoItems, left: itemsLeft }); //render the ejs && zebra is the collection & todoItems is array of objects of info
});

//route of create request && the callback function
app.post('/createTodo', (req, res) => {
  db.collection('todos') //specific todo collection inside database
    .insertOne({ todo: req.body.todoItem, completed: false }) //insert one document with two 'key: value' pairs; request.body.todoItem is what's coming through html form
    .then((result) => {
      console.log('Todo has been added!');
      res.redirect('/'); //respond with reload to show the new post
    });
});

//route of update request && the callback function
app.put('/markComplete', (req, res) => {
  db.collection('todos') //specific todo collection inside database
    .updateOne(
      //update one document && task property used to find document; $set is the property being updated through change in ejs and the smurf in the main.js
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      res.json('Marked Complete'); //response to the JS that sent the put request
    });
});

//route of update request && the callback function
app.put('/undo', (req, res) => {
  db.collection('todos') //specific todo collection inside database
    .updateOne(
      //update one document && task property used to find document; $set is the property being updated through change in ejs and the smurf in the main.js
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: false,
        },
      }
    )
    .then((result) => {
      console.log('Marked Complete');
      res.json('Marked Complete'); //response to the JS that sent the put request
    });
});

//route of delete request && the callback function
app.delete('/deleteTodo', (req, res) => {
  db.collection('todos') //specific todo collection inside database
    .deleteOne({ todo: req.body.rainbowUnicorn }) //delete one document based off the mentioned task
    .then((result) => {
      console.log('Deleted Todo');
      res.json('Deleted It'); //response to the JS that sent the delete request
    })
    .catch((err) => console.log(err)); //catches errors in fulfilling the promise
});

// create server port the browser connects t
//environment variable PORT *or* 3000 (localhost)
app.listen(process.env.PORT || PORT, () => {
  console.log('Server is running, you better catch it!');
});
