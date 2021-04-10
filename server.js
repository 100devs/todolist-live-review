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
    // The string assigned to us from Mongo Atlas so we can talk with our database. The actual string is in our .env file
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

// GET request to the main route using the await syntax
app.get('/', async (req,res)=>{
    // Find all the objects in our database collection and place them into a variable called 'todoitems'
    const todoItems = await db.collection('todos').find().toArray()
    // Find all the objects in our database that have the completed property with the value of false and store it in a variable called 'itemsLeft'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Rendering our EJS file within our views folder with the data our variables are storing above
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

// Our PUT request route for marking a todo as complete
app.put('/markComplete', (req, res)=>{
    // We're going into our database and trying to find a property that matches, while using some built-in syntax to update our todo property from 'false' to 'true'
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // A property built into Mongo
        $set: {
            // Changing the completed property to 'true'
            completed: true
        }
    })
    .then(result =>{
        // Logging for ourselves that we've labeled the todo as "marked Complete"
        console.log('Marked Complete')
        // We're sending a JSON response saying "Marked Complete"
        res.json('Marked Complete')
    })
})

// Our PUT request route when changing a todo from complete to incomplete/revert back to it's default state
app.put('/undo', (req, res)=>{
    // Going into our database that will find a match to the text and target that for any changes we're asking it to make
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // A property we have access to with Mongo
        $set: {
            // Changing our 'completed' property back to false
            completed: false
        }
    })
    .then(result =>{
        // Logging any changes for ourselves so it's easier to see any changes the server served up
        console.log('Marked Complete')
        // Sending a json response 
        res.json('Marked Complete')
    })
})

// DELETE Request route 
app.delete('/deleteTodo', (req, res)=>{
    // Going into our database and looking at our todos that matches the property name of 'rainbowUnicorn', which will be deleted
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        // Logging in our console that we successfully deleted our todo
        console.log('Deleted Todo')
        // Sending a 'Deleted It' string to the json response in our main.js file to answer the fetch
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// Function that listens for port connections that enables our server to run, whether something chosen by our host or our own local port
app.listen(process.env.PORT || PORT, ()=>{
    // Logging to confirm that our server is indeed running.
    console.log('Server is running, you better catch it!')
})    