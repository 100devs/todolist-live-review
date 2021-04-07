//allows us to use express
const express = require('express')
//tie a variable to simplify using express in our code, anywhere we see 'app' we are using express
const app = express()
//allows us to us mongoDb to create our database and collections
const MongoClient = require('mongodb').MongoClient
// a variable to hold our port number and allow us to call it in our code
const PORT = 2121
//allows us to use a .env file to keep some of our info secret
require('dotenv').config()
//setting multiple variables for calling to the database, holding and using our mongoDb connection link, and to refernece our db name.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//sets up the connectionn to the mongo client and an arrow function to give feedback that the db is connected
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
//allows node to use express, ejs, our static files in a public folder, i cant remember what urlencoded does but i think it does something for the mongo db link.
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//loads our page and sets any todos in an array and prints them to the dom the C in our crud create
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//allows us to post a todo into the dom i think this is thr R in our crud
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
//allows us to mark off a todo with a click event this is the U in our crud
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
//allows us to undo our crossed out todo using the same element for the cross off this is also a U in our crud
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
//allows us to use delete in our todo tied to a click event
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
//listens to for and connects us to our port and also allows haroku to set a port for us 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    