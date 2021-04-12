// use express from node modules
const express = require('express')
// create the express object to use in this app
const app = express()
// use mongodb from node modules
const MongoClient = require('mongodb').MongoClient
// define the port to use when running app locally
const PORT = 2121
// use the .env file as a config file
require('dotenv').config()

// create database connection strings
let db,
    dbConnectionStr = process.env.DB_STRING,
    // declare and initialize db string
    dbName = 'todo'
// i dont know what useUnifiedTopology does or what it controls
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // confirm db connection
        console.log(`Hey, connected to ${dbName} database`)
        // initialize db conncection
        db = client.db(dbName)
    })
    .catch(err => {
        // log any caught error
        console.log(err)
    })
// set the ejs view engine
app.set('view engine', 'ejs')
// i dont know what this does
app.use(express.static('public'))
// this i believe, encodes urls passed through the application
app.use(express.urlencoded({ extended: true }))
// use json data 
app.use(express.json())

// send a get request from teh root directory
app.get('/', async (req, res) => {
    // collect the todos from the database and convert  to array
    const todoItems = await db.collection('todos').find().toArray()
    // collect the todos which have not been completed
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    // use the index ejs file to render the view on the client side
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
})

// send a post request in the createTodo directory
app.post('/createTodo', (req, res) => {
    // insert a todo item and set as incomplete
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
        .then(result => {
            // confirm the insertion of the new todo item
            console.log('Todo has been added!')
            // route the reponse back to the root
            res.redirect('/')
        })
})

// send a put request to the markComplete file
app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
        // replace the current with true
        $set: {
            completed: true
        }
    })
        // confirm change in the console and update the json with the response
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
})
// send a put to the undo file
app.put('/undo', (req, res) => {
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
        // replace the current value with false
        $set: {
            completed: false
        }
    })
        // confirm the result in the console, update the json with the response
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
})

// send a delete rquest to deleteTodo file
app.delete('/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
        // confirm the delete request and update the json file with the response
        .then(result => {
            console.log('Deleted Todo')
            res.json('Deleted It')
        })
        .catch(err => console.log(err))
})
// set the application to listen for requests
app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!')
})