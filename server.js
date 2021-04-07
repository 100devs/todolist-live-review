// imports the express npm module to give us access to http methods
const express = require('express')
// assigns express to the variable app
const app = express()
// gives us the ability to connect to the mongo database
const MongoClient = require('mongodb').MongoClient
// assigns our port of choice to the variable PORT
const PORT = 2121
// gives us access to the hidden variables in the .env file
require('dotenv').config()

// declares variables to hold our database, connection string and database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connects to the database and assigns the database to the db variable ???
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
// tells our app the html template is ejs?
app.set('view engine', 'ejs')
// tells our app where our client-side code is located
app.use(express.static('public'))
// I DON'T KNOW
app.use(express.urlencoded({ extended: true }))
// allows express to use json formatting
app.use(express.json())

// performs a get request for our client-side HTML/CSS & JS
app.get('/', async (req,res)=>{
    // stores all the documents in the database in an array we can access
    const todoItems = await db.collection('todos').find().toArray()
    //  takes a count of how many documents have a completed property with a value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the ejs and passes in the todos and the count of how many are still not completed.
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// creates a post request to add a document to our database 
app.post('/createTodo', (req, res)=>{
    // takes the info collected from the form in our ejs and uses it to create the new document
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        // refreshes the page
        res.redirect('/')
    })
})

// Sends a put request to our database
app.put('/markComplete', (req, res)=>{
    // finds a document in the database that matches our request
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // updates the completed property on said document to True from false
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
// Sends a put request to our database
app.put('/undo', (req, res)=>{
    // finds a document in the database that matches our request
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // changes the completed property on said document to false back from true
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
// Sends a delete request to our database
app.delete('/deleteTodo', (req, res)=>{
    // finds a document in the database that matches our request and deletes it
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
// tells our app what server port to run on ? Not sure how this works.
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    