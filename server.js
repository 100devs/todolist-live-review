//import express module and set it to a constant named express
const express = require('express')
//execute express and set the execution equal to a constant named app
const app = express()
//import the mongodb module and set it equal to a constant named MongoClient
const MongoClient = require('mongodb').MongoClient
// set the port we use for our server to 2121
const PORT = 2121
// use the dotenv module for this project and execute its config function
require('dotenv').config()
//allocate memory for db variable
let db,
// create dbConnectionStr variable and set it equal to the .env variable DB_STRING
    dbConnectionStr = process.env.DB_STRING,
    // create the dbName variable and set it equal to 'todo'
    dbName = 'todo'
//connect to the cloud database using dbConnectionStr with setting useUnifiedTopology as true (reduce some maintenance burden on driver, remove complicated functionality, abstract away topology, etc)
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//after connection, if connection worked, use .then() with a callback anonymous function with client as only argument
    .then(client => {
        // log connection statement to terminal
        console.log(`Hey, connected to ${dbName} database`)
        // set db equal to the resolved connected database in the cloud
        db = client.db(dbName)
        // end .then() block
    })
    // if connection did not occur, anonymous callback function with err as only argument
    .catch(err =>{
        // log the error to the console
        console.log(err)
        // end .catch() block
    })
// express loads the ejs template engine module
app.set('view engine', 'ejs')
// express uses the public directory to serve static files
app.use(express.static('public'))
// express uses middleware to parse urlencoded post/put requests
app.use(express.urlencoded({ extended: true }))
// express uses middleware to parse json encoded post/put requests
app.use(express.json())

// when the server receives a get request for the root page execute anonymous asynchronous function with req,res arguments
app.get('/', async (req,res)=>{
    // create constant todoItems and set it equal to the settled promise of finding a collection named todos in the connected database, getting all the documents in the database and converting the documents into an array
    const todoItems = await db.collection('todos').find().toArray()
    // create itemsLeft constant and set it equal to the settled promise of finding the collection named todos and counting the number of database documents that have a completed value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // the server renders the file index.ejs to the browser with (why did we use zebra, Leon?) the data from the collections
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
    // end of the app.get('/') block
})
// when the server gets a POST request to the /createTodo route, it executes an anonymous callback function with req, res as arguments
app.post('/createTodo', (req, res)=>{
    //execute the insertOne function on the db collection todo to add a document to the collection with the given request parameters
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // once the document has been added to the collection execute the anonymous callback function with an argument of result
    .then(result =>{
        // log the success statement to the terminal
        console.log('Todo has been added!')
        // reload the root page
        res.redirect('/')
        // end of the .then() block
    })
    // end of the .post('/createTodo') block
})
// when the server receives a PUT request to the '/markComplete' route, it executes an anonymous callback function with req,res as arguments
app.put('/markComplete', (req, res)=>{
    // if the database has a document in the todo collection with the values that match those of the request parameters, it selects the first one, otherwise we are working on a new document with the requested parameter
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // when the update executes, the $set object contains the info to be changed
        $set: {
            // now the updated or new document will have a completed value of true
            completed: true
            // end of the $set block
        }
        // end of the .updateOne() request block
    })
    // once the database update is finished execute the anonymous callback function with result as the only argument
    .then(result =>{
        // log to the terminal that the update is finished
        console.log('Marked Complete')
        // log to the browser console that the update is finished
        res.json('Marked Complete')
        // end of the .then() block
    })
    // end of the .put('/markComplete') block
})
// when the server receives a PUT request from the '/undo' route it executes an anonymous callback function with req,res as arguments
app.put('/undo', (req, res)=>{
     // if the database has a document in the todo collection with the values that match those of the request parameters, it selects the first one, otherwise we are working on a new document in the collection with the requested parameters
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //when the update executes the $set object contains the parameters to be updated
        $set: {
            // set the document's completed value to false
            completed: false
            // end of $set block
        }
        // end of update block
    })
    // once the update executes, if successfull execute an anonymous callback function with result as the only parameter
    .then(result =>{
        // log completion statement to the terminal
        console.log('Marked Complete')
        // log completion statement to the browser console
        res.json('Marked Complete')
        // end of then block
    })
    // end of '/undo' route block
})
// when the server receives a DELETE request to the '/deleteTodo' route, execute an anonymous callback function with req,res as its only arguments
app.delete('/deleteTodo', (req, res)=>{
    // find the first document in the 'todos' collection of the database whose todo value matches the request's value and delete it
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // once found and deleted execute an anonymous callback function with result as its only argument
    .then(result =>{
        //log deletion statement to the terminal
        console.log('Deleted Todo')
        // log deletion statment to the browser console
        res.json('Deleted It')
        // end of then block
    })
    // if there was an error in deletion, log the error to the terminal
    .catch( err => console.log(err))
    // end of '/deleteTodo' block
})
 // the express server should listen for requests on the port specified in the .env file or the port specified in the PORT constant and then execute an anonymous callback function
app.listen(process.env.PORT || PORT, ()=>{
    // log cheeky statement to the console
    console.log('Server is running, you better catch it!')
    // end of app.listen() block
})    