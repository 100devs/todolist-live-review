//sets the node modules of express to the constant 'express'
const express = require('express')
//sets the functions of express to app as a constant
const app = express()
//sets up the package so that we can connect to the database
const MongoClient = require('mongodb').MongoClient
//assigns a PORT number to out server
const PORT = 2121
//sets up our environment so that we can hide sensitive information
require('dotenv').config()

//assigns the variables to hold the database, and the name of the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connects to the database using a string and an object
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        //stores database connection as variable db 
        db = client.db(dbName)
    })
    //handles errors
    .catch(err =>{
        console.log(err)
    })

//enables the engine to use ejs files 
app.set('view engine', 'ejs')
// serves up static files
app.use(express.static('public'))
// views the requests as json files
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// gets the public file to show the user
app.get('/', async (req,res)=>{
    // assigns an array of objects from the database to the constant 
    const todoItems = await db.collection('todos').find().toArray()
    // assigns a boolean of False for items that have been completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the index.ejs file and assigns the constants to zebra and left for use in the ejs file.
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// posts a newly created item to the list
app.post('/createTodo', (req, res)=>{
    // adds in the new item to the list as a document, with the completed set as false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        // reloads the page to include the new item
        res.redirect('/')
    })
})

// marks an item as completed using a slash styling
app.put('/markComplete', (req, res)=>{
    // Updates the boolean value from false to true
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

// marks an item as not completed by removing the slash styling
app.put('/undo', (req, res)=>{
    // updates the boolean value from true to false
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

// deletes the item from todos
app.delete('/deleteTodo', (req, res)=>{
    // deletes the item from the todo list if it finds a match
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
// starts the server. makes callback if successful
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    