// IMPORTS AND SETUP
// import express and assign to variable "express"
const express = require('express')
// new variable "app" which is an instance of express
const app = express()
// new variable "MongoClient" which imports and uses mongodb
const MongoClient = require('mongodb').MongoClient
// a semi-random default port number inspired by 21Savage
const PORT = 2121
// import dotenv, which helps us with the .env file security
require('dotenv').config()

// DATABASE VARIABLES
// db: empty variable
let db,
    // dbConectionStr: imports environment variable DB_STRING to use to connect to the database.
    // It will hold all the user/password info, as well as which database to talk to. The contents should NEVER be shared publicly!
    dbConnectionStr = process.env.DB_STRING,
    // dbName: the name of the database we'll be talking to
    dbName = 'todo'

// MAKING THE MONGO CONNECTION
// start the connection with the connection string and that funny little unifiedTopology setting that prevents warnings
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // when the connection is made
    .then(client => {
        // message in the console that we've connected, and to the database named above
        console.log(`Hey, connected to ${dbName} database`)
        // assign "db" variable the value of the database info so we can refer to the database later on with just "db"
        db = client.db(dbName)
    })
    // if the connection doesn't happen
    .catch(err =>{
        // message in the console whatever error info we can get
        console.log(err)
    })

// SET UP THE APPLICATION WITH MIDDLEWARE  
// tell the application to look for an ejs file to make the display
app.set('view engine', 'ejs')
// tell the application to look in the public folder for anything referred to by file location
app.use(express.static('public'))
// used to be bodyparser
// parses incoming URL-encoded requests into JSON
app.use(express.urlencoded({ extended: true }))
// tells application to be ready to use JSON
app.use(express.json())


// REQUEST TYPES
// get request, asynchronous, will wait until it's been asked to run by a method:get request
app.get('/', async (req,res)=>{
    // waits for connection to database, then stores an array of the items in the "todos" collection in todoItems
    const todoItems = await db.collection('todos').find().toArray()
    // waits for connection to database, then stores the number of items in the "todos" collection for which "completed" is false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // passes variables "zebra" = todoItems and "left" = itemsLeft to the index.ejs file for use in ejs code
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// post request, asynchronous, will wait until it's been asked to run by a method:post request
app.post('/createTodo', (req, res)=>{
    // connects to the "todos" collection in the database, then inserts one item with the values from the form submitted in "req", and a default "completed" value of false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // after that succeeds
    .then(result =>{
        // message the console that "todo has been added"
        console.log('Todo has been added!')
        // send view back to homepage, effectively refreshing and sending a new get request to show the updated todo list
        res.redirect('/')
    })
})

// put request, asynchronous, will wait until it's been asked to run by a method:put request
app.put('/markComplete', (req, res)=>{
    // connects to the "todos" collection in the database, then modifies the one with the todo value that matches the todoText, that main.js nicknamed rainbowUnicorn, that was clicked on
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // update the value of
        $set: {
            // completed to true
            completed: true
        }
    })
    // when that's done
    .then(result =>{
        // message console that it's complete
        console.log('Marked Complete')
        // sends a message in the response json that the item was marked complete
        res.json('Marked Complete')
    })
})

// put request, asynchronous, will wait until it's been asked to run by a method:put request
app.put('/undo', (req, res)=>{
    // connects to the "todos" collection in the database, then modifies the one with the todo value that matches the todoText, that main.js nicknamed rainbowUnicorn, that was clicked on
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // update the value of
        $set: {
            // completed to false
            completed: false
        }
    })
    // when that's done
    .then(result =>{
        // message console that it's complete
        console.log('Marked Complete')
        // sends a message in the response json that the item was marked complete
        res.json('Marked Complete')
    })
})
// delete request, asynchronous, will wait until it's been asked to run by a method:delete request
app.delete('/deleteTodo', (req, res)=>{
    // connects to the "todos" collection in the database, then finds the one that matches the todoText, nicknamed rainbowUnicorn, and deletes the item that matches
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // when that's done
    .then(result =>{
        // message console that it was deleted
        console.log('Deleted Todo')
        // sends a message in the response json that the item was deleted
        res.json('Deleted It')
    })
    // if something doesn't work right send a message to the console with whatever error info we can get
    .catch( err => console.log(err))
})
 
// tells the application to keep listening on either the port that the environment (heroku) tells it to use with the environment variable
// or the port we've stored in PORT variable above
app.listen(process.env.PORT || PORT, ()=>{
    // when it starts listening, message the console!
    console.log('Server is running, you better catch it!')
})    