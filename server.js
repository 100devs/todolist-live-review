//these are the dependensies that you have already installed that you must require to run your app
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//declaration of all three variables including the DB_String that is in your .env file that isn't pushed to github
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


//Using the built in MogoClient methods to connect to the database and console loging that you're connected. 
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

//Your middleware along with the sweet express.static('public') that serves up all our static files without worrying about routes.
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//the async await syntax for rendering the EJS file along with our array of items
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//This is how we create a todo, it inserts a document into our array with the insertOne method.
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

//An update put request that marks a todo item as complete
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


//An update put request that undos the marked as complete from the previous put request
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


//The delete request that will delete an item from our array
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
//Our connection to the heroku PORT or ours depending on where it's running
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    
