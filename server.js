// require express to have access to their modules
const express = require('express')
// variable to store express
const app = express()
// use MongoClient to connect to the database
const MongoClient = require('mongodb').MongoClient
// set up PORT so we can use this on local server
const PORT = 2121
// require dotenv to hide details such as dbconnectionstr
require('dotenv').config()

// our entire connected database is inside variable db
// we're using let to declare three variables separated by a comma instead of typing let three times
let db,
// use string to connect to mongoAtlas. we use dotenv to grab db_string so other people can't see sensitive info
    dbConnectionStr = process.env.DB_STRING,
    // our database name is todo
    dbName = 'todo'

// connect is a method from MongoClient - it takes in a connection string and another object. we need topology so we don't get errors
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
// this returns a promise so we need .then() and .catch()
// .then() is our connection to the database - client is holding our connection
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        // we're now connected to the database, then we grab connection and store it into db - now db is our connection to the database
        db = client.db(dbName)
    })
    // catch errors 
    .catch(err =>{
        console.log(err)
    })

// set up server using middlewares (all the things my server is gonna use)
// set our view engine so that our application is set up to use ejs files
app.set('view engine', 'ejs')
// server can serve up any files in public folder (html/css/client side js)
app.use(express.static('public'))
// bottom two lines allow us to look at the application, look at the request, and pull data from the request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// GET Request
// get request takes in a req (request) and res (response)
app.get('/', async (req,res)=>{
    // grabs all the to dos
    const todoItems = await db.collection('todos').find().toArray()
    // grabs all the items with completed: false - the incomplete tasks
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// POST Request
// route is whatever the action is in the form in index.ejs (in this case it's action="/createTodo")
// req and res allow us to handle the request and the response - we need both in order to do anything
// returns ANOTHER promise like GET request
app.post('/createTodo', (req, res)=>{
    // after request is made, we need to push it to the server
    // insertOne is a method that allows us to insert one document into the collection Todos
    // we need to grab data from the body of the request. the body is linked to the input name ="todoItem" in index.ejs -> (req.body.todoItem)
    // when we make a post on that form, we're creating a document that has a toDo property and its value from the form
    // completed: false - a document is created that has a todo property and a completed property that's always false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // returns a promise so we need .then() again
    .then(result =>{
        console.log('Todo has been added!')
        // handles response - we want to respond with refreshing the page so that we can see the updated list
        res.redirect('/')
    })
})

// PUT Request
// we need to change the doc from completed: false to completed: true
app.put('/markComplete', (req, res)=>{
    // we want to go to db, and doc collection, and update one document where the text matches what we clicked on
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // once you find that match, set the completed property to true
        $set: {
            completed: true
        }
    })
    // returns a promise so we need .then()
    .then(result =>{
        console.log('Marked Complete')
        // we're responding back to the fetch that came from client side js with Marked complete
        res.json('Marked Complete')
    })
})

// PUT request for Undo
app.put('/undo', (req, res)=>{
    // go to db and doc collection and update one document where the completed property has value of true then change it to false
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    // returns a promise so we use .then()
    .then(result =>{
        console.log('Undo')
        // respond to client side JS wtith "Undo"
        res.json('Undo')
    })
})

// DELETE Request
// get route from fetch url in main.js ('deleteTodo)
// go to the database and find todos - delete the task where the to do text matches the text next to delete
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // returns a promise so we use .then()
    .then(result =>{
        console.log('Deleted Todo')
        // respond to client side JS with "Deleted It"
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
// listening for the start of the server - takes in a port and a callback once it connects
// we use dotenv to connect it through heroku bc the IP addresses will be different
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    