// bring in express to help us serve content
const express = require('express')
// declare express as "app" to use later
const app = express()
// bring in the package so we can manage MongoDB
const MongoClient = require('mongodb').MongoClient
// set a hard-coded default port for the browser to use
const PORT = 2121
// bring in "dotenv" package to help us manage our environment variables -- and help keep our secrets
require('dotenv').config()

// set variables for our database connection
let db,
// set the string to connect to the database, from an external file, that has our login credentials that we want to keep secret
    dbConnectionStr = process.env.DB_STRING,
// name of the database to get our info from
    dbName = 'todo'

// connect to MongoDB
// I don't know what useUnifiedTopology is
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// .then and .catch because we are using promises, so it will wait until the connection to the database is ready before proceeding to the next step
    .then(client => {
// log to the console that we are connected
        console.log(`Hey, connected to ${dbName} database`)
// set db to the actual connection, so we have to use less code in the rest of the application
        db = client.db(dbName)
    })
// if something goes wrong, .catch will output the error to the console
    .catch(err => {
        console.log(err)
    })

// I DO NOT KNOW IF WE HAVE TO SPECIFICALLY SAY 'view engine' and why
// using ejs as our templating engine, aka Embedded Javascript
app.set('view engine', 'ejs')
// BEST LINE OF CODE EVER - set everything in the /public folder to serve automatically so we don't have to make an entry for Every. Single. File.
app.use(express.static('public'))
// I DO NOT KNOW "EXACTLY" WHY WE NEED THIS 
// but something to do with the content being served with express. I think it will url-encode the content as needed.
app.use(express.urlencoded({ extended: true }))
// I DO NOT KNOW "EXACTLY" WHY WE NEED THIS
// but it's going to enable express to parse JSON
app.use(express.json())

// When the server gets a request for "/", the top-level 
// using async / await because we need to wait until we get data back from the dababase
app.get('/', async (req, res) => {
// todoItems is coming from the todos collection. find() gets all documents. toArray() puts them into an array
    const todoItems = await db.collection('todos').find().toArray()
// itemsleft is coming from the todos collection. countDocuments() gets a count, of all documents where completed is false
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
// res = response
    // render is going to use index.ejs and send it todoItems as "zebra" and itemsLeft as "left"
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
})

// when server gets request for "/createTodo" after the domain,
app.post('/createTodo', (req, res) => {
// insert one document to the "todos" collection
// todo will be "todoItem" from the body of the request "req"
// completed will be set to false by default for every item
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
// wait for the insert to complete, then...
        .then(result => {
// log to console
            console.log('Todo has been added!')
// refresh the default home page (redirect)
            res.redirect('/')
    })
})

// when server gets request for "/markComplete"
app.put('/markComplete', (req, res) => {
// update one document in the "todos" collection
// update the 'todo' item that matches "rainbowUnicorn" from the request body
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
// set completed to true, using this mongodb operator "$set"
        $set: {
            completed: true
        }
    })
    .then(result =>{
// wait for that to complete, then console log
        console.log('Marked Complete')
// and respond with a message in JSON format
        res.json('Marked Complete')
    })
})

// when "/undo"
app.put('/undo', (req, res) => {
// update one document in the "todos" collection
// update the 'todo' item that matches "rainbowUnicorn" from the request body
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
// set completed to false, using this mongodb operator "$set"
        $set: {
            completed: false
        }
    })
    .then(result =>{
// wait for that to complete, then console log
        console.log('Marked Complete')
// and respond with a message in JSON format
        res.json('Marked Complete')
    })
})

// when we receive the request "/deleteTodo"
app.delete('/deleteTodo', (req, res) => {
// delete one document in the "todos" collection
// delete the 'todo' item that matches "rainbowUnicorn" from the request body
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
    .then(result =>{
// wait for that to complete, then console log
        console.log('Deleted Todo')
// and respond with a message in JSON format
        res.json('Deleted It')
    })
// if there's an error, catch it and log it to console
    .catch( err => console.log(err))
})
 
// listen on the port from our environment variables (which for a hosted service like Heroku would be set in the interface), or if that's not present, use the constant PORT that we set
app.listen(process.env.PORT || PORT, () => {
// log success message to console
    console.log('Server is running, you better catch it!')
})    