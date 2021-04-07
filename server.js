const express = require('express')                  //  Load the Express module
const app = express()                               //  Create an Express app
const MongoClient = require('mongodb').MongoClient  //  Load MongoDB module
const PORT = 2121                                   //  Define the port to listen for request on
require('dotenv').config()                          //  Load dotenv module and read environment variables

let db,                                         //  Create database variable to be assigned later
    dbConnectionStr = process.env.DB_STRING,    //  Get the database connection string from the DB_STRING environment variable
    dbName = 'todo'                             //  Store the name of the database to connect to

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })    //  Connect to MongoDB using the connection string
    .then(client => {                                               //  When connected
        console.log(`Hey, connected to ${dbName} database`)         //      Log a message to show that connection was successful
        db = client.db(dbName)                                      //      Get the database
    })                                                              //  End Then
    .catch(err => {                                                  //  If connection couldn't happen
        console.log(err)                                            //      Log the error message
    })                                                              //  End catch

app.set('view engine', 'ejs')                       //  TODO: Figure out what this is doing
app.use(express.static('public'))                   //  TODO: Figure out what this is doing
app.use(express.urlencoded({ extended: true }))     //  TODO: Figure out what this is doing
app.use(express.json())                             //  TODO: Figure out what this is doing

// Here starts API stuff

app.get('/', async (req, res) => {                                                         //  Respond to a HTTP GET on the root
    const todoItems = await db.collection('todos').find().toArray()                     //  Get the collection of todo items from MongoDB and convert it to an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })   //  Count the number of documents marked incomplete from the collection
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })                        //  Send the items and the number of items to complete to EJS
})                                                                                      //  End GET

app.post('/createTodo', (req, res) => {                                               //  Respond to a HTTP POST on createTodo
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })   //  Add a new todo item to the collection from MongoDB
        .then(result => {                                                                //  Then
            console.log('Todo has been added!')                                         //      Log that the item has been added
            res.redirect('/')                                                           //      HTTP GET the root so the new item can be added to the page and sent to the client
        })                                                                              //  End Then
})                                                                                  //  End POST

app.put('/markComplete', (req, res) => {                                  //  Respond to a HTTP PUT on markCompleted
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {  //  Find the item in the collection to update
        $set: {                                                         //  Identify what part of the record to update
            completed: true                                             //      In this case, set the completed field to true
        }                                                               //  End set
    })                                                                  //  End updateOne
        .then(result => {                                                    //  Then
            console.log('Marked Complete')                                  //      Server log the update
            res.json('Marked Complete')                                     //      Send log message to the client
        })                                                                  //  End then
})                                                                      //  End PUT

app.put('/undo', (req, res) => {                                          //  Respond to a HTTP PUT on undo
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {  //  Find the item in the collection to update
        $set: {                                                         //  Identify what part of the record to update
            completed: false                                            //      In this case, set the completed field to false
        }                                                               //  End set
    })                                                                  //  End updateOne
        .then(result => {                                                    //  Then
            console.log('Marked Complete')                                  //      Server log the update
            res.json('Marked Complete')                                     //      Send log message to the client
        })                                                                  //  End then
})                                                                      //  End PUT

app.delete('/deleteTodo', (req, res) => {                                 //  Respond to a HTTP DELETE on deleteTodo
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })    //  Find the item in the collection and delete it
        .then(result => {                                                    //  Then
            console.log('Deleted Todo')                                     //      Server log the deletion
            res.json('Deleted It')                                          //      Send log message to the client
        })                                                                  //  End then
        .catch(err => console.log(err))                                    //  If an exception is raised, then server log it
})

app.listen(process.env.PORT || PORT, () => {                  //  Tell the app to listen to the port from the environment variable PORT, or the PORT defined at the beginning of the file
    console.log('Server is running, you better catch it!')  //  Server log that the server is running.
})