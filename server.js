// declearing a variable on express
const express = require('express')
// declearing a variable on app
const app = express()
// declearing a variable on MongoClient
const MongoClient = require('mongodb').MongoClient
// declearing a variable on port
const PORT = 2121
// declearing .env global variables
require('dotenv').config()

// declearing variables to connect into the dataBase
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// the DB connection 
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) 
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

// setting UP ejs as view engine
app.set('view engine', 'ejs')
// setting up the free access to a dir called Public
app.use(express.static('public'))
// setting up the Language DB can understand when posting in a data into the DB
app.use(express.urlencoded({ extended: true }))
// setting up JSON connection to the DB
app.use(express.json())


// using get method to speak to the DB, and pull a home page request.
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// using post method to add a new todoDocument into the todosCollection on the DB
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

// using put method to updateOne of the document inside the todo collection from FALSE to TRUE
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

// using put method to updateOne of the document in the todo collection from TRUE to FALSE
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

// using delete method to deleteOne of the document inside the todos collection
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
// app.listen is where the todos is hosted on
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    