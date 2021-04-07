// Allows us to use express
const express = require('express')
// Gives us easy access to express with the 'app' variable
const app = express()
// Allows us to use Mongo
const MongoClient = require('mongodb').MongoClient
// This is the port variable to tell where the server will listen
const PORT = 2121
// This allows us to use .env to hide our secrets
require('dotenv').config()

// Database variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// This connects to our MongoDB
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // After promise is fulfilled, we'll do some stuff
    .then(client => {
        // Letting us know if we connected and to which DB
        console.log(`Hey, connected to ${dbName} database`)
        // This sets the path to the database (i think) into the db variable
        db = client.db(dbName)
    })
    // Catching errors here...
    .catch(err =>{
        console.log(err)
    })

// This tells the app to look to view/ejs for rendering dynamic html
app.set('view engine', 'ejs')
// This tells the app where to find public files (css, js)
app.use(express.static('public'))
// I'm not sure exactly what this does, but it has something to do with letting the client read data from the server...
app.use(express.urlencoded({ extended: true }))
// This allows the client side device to parse json data
app.use(express.json())

// This tells the server what to serve when the client goes to the root
app.get('/', async (req,res)=>{
    // Parse the DB collections into an array
    const todoItems = await db.collection('todos').find().toArray()
    // I'm assuming this counts the number of docs in our collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Renders our EJS file
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// This tells the server what to do when a POST is sent to 'createTodo'
app.post('/createTodo', (req, res)=>{
    // This tells our 'todos' collection to insert a document that contains a 'todo' and a 'completed' property 
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // Once promise is fulfilled, do some more stuff
    .then(result =>{
        console.log('Todo has been added!')
        // Refresh page to the root - GET root
        res.redirect('/')
    })
})

// This tells server what to do when a PUT request is sent to 'markComplete'
app.put('/markComplete', (req, res)=>{
    // Tells 'todos' collection to update the 'todo' property on the clicked object
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // Sets property of 'completed' to true
        $set: {
            completed: true
        }
    })
    // Once promise is fulfilled, do stuff
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// Tells server what to do when a PUT request is sent to 'undo'
app.put('/undo', (req, res)=>{
    // Tells our collection to update the 'todo' prop on clicked object
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // Set the property to false
        $set: {
            completed: false
        }
    })
    // Once promise is fulfilled, do stuff
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// Handles a DELETE request to 'deleteTodo'
app.delete('/deleteTodo', (req, res)=>{
    // Tells our collection which todo to delete
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// Tells our server which PORT to listen on (either listen in the dev environment or on local PORT)
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    