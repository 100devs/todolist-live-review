// installing and using the dependencies
const express = require('express') 
// takes express and running it (can use app.)
const app = express()
// connecting to the database
const MongoClient = require('mongodb').MongoClient
// port we are hosting on
const PORT = 2121
require('dotenv').config()

// name of database and the connection url from mondodb
let db,
dbConnectionStr = process.env.DB_STRING,
dbName = 'todo'

// useUnifiedTopology is to prevent errors when building our project
// connect takes in the connection string and another object(unified thing)
// this whole thing is a prompt (promise) and once its connected to the db then the .then runs
// inside the .then is our connection to the client(db)
// storing the connection in the db variable(client.db(dbName)
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
// the catch that handles the promise
    .catch(err => {
        console.log(err)
    })

    // setting up the server and everything it needs to do its job
    // application is set up to use the ejs file
app.set('view engine', 'ejs')
// server can serve up whatever is in the public folder
app.use(express.static('public')) 
// to look at the application, look at req and pull data
app.use(express.urlencoded({ extended: true})) 
// to look at the application, look at req and pull data
app.use(express.json())

// getting the req from the user and connecting ejs
// find will find all the documents in the collection
// this whole thing is a promise so it needs a .then
// zebra is the array of objects
app.get('/', async (req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// talking to the database through this route(app.post)
// createTodo is from the action form in our ejs
// need req and res to handle the request and response in order for us to do anything
// we are then pushing to the database
// insertOne enables us to insert a document into the db collection (will take in two things (information from the user from the form))
// completed false that is a property that will always be false (because its a todo item that should not have a complete status) 
app.post('/createTodo', (req, res) => {
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo has been added')
        res.redirect('/')
    })
})

// updateOne methods takes in a bunch of stuff. first thing it takes in is the match (todo:)
// once it finds a match, $set it to true
app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// deleteTodo is from the fetch so now they connect
// deleteOne is trying to find a match with all the todo properties
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// the way to start our server. app.listen takes in PORT
    app.listen(process.env.PORT || PORT, () => {
        console.log('running')
    })