// Variable declaration so we can utilize Express more fluidly in our code without constantly typing 'require('express)' each time.
const express = require('express')
// Declaring that our app is running Express
const app = express()
// So we can connect with our MongoDB database
const MongoClient = require('mongodb').MongoClient
// Variable declaration for our local port
const PORT = 2121
// ??? Something required from our dotenv package ??? 
require('dotenv').config()

// db variable holds the connection to our database
let db,
    // The string assigned to us from Mongo Atlas so we can talk with our database
    dbConnectionStr = process.env.DB_STRING,
    // The name of our database
    dbName = 'todo'

// Mongo Atlas code block to secure our connection with our database
// Remember, 'dbConnectionStr' is the string given to us from Mongo Atlas, while ??? '{useUnifiedTopology: true}' ??? I've got no clue, but it just works!
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // Our function that runs if our Promise is fulfilled
    .then(client => {
        // Log confirming we've gonnected to our database
        console.log(`Hey, connected to ${dbName} database`)
        // Storing our connection from the database inside the db variable we declared earlier
        db = client.db(dbName)
    })
    // Our function that runs if our Promise fails/gets rejected
    .catch(err =>{
        console.log(err)
    })

// Setting up our application to use EJS files that's accessible in the views folder
app.set('view engine', 'ejs')
// Telling our server that we can serve up these static files located in the 'public' folder
app.use(express.static('public'))
// ??? .urlencoded and .json acts similar to the bodyParser package; it's magic code middleware that can pull data within our requests so that we can use it elsewhere in our application ???
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// GET request to the main route
app.get('/', async (req,res)=>{
    // Find all the objects in our database collection and place them into an array
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Rendering our EJS file within our views folder
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// POST request tied to our form action in the EJS document
app.post('/createTodo', (req, res)=>{
    // Storing new entries into our database with two properties: one stores the actual todo coming from the todoItem form in our EJS and the other is the status if a todo has been completed
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        // Logging to confirm a todo has been added to the list
        console.log('Todo has been added!')
        // Redirecting the user to the main page if the promise resolves
        res.redirect('/')
    })
})

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

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// Function that listens for port connections that enables our server to run
app.listen(process.env.PORT || PORT, ()=>{
    // Logging to confirm that our server is indeed running.
    console.log('Server is running, you better catch it!')
})    