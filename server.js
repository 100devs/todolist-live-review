// make sure we are requiring express,
const express = require('express')
const app = express()
//mamking sure we are using mongodb
const MongoClient = require('mongodb').MongoClient
// PORT will be the port number now
const PORT = 2121
// has the env file do its job in hiding sensitive things
require('dotenv').config()
// lets the dbstring = conection string
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// Connecting to the mongo database
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
// lets us use ejs, express
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// getting the collection from mongodb along with responding with ejs
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
// adds a todo when it is submitted
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
// marking the text as complete (true)
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
// marking the text as incomplete complete (false)
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
// deleting the added todo item
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 // listening for the port its connecting to in order to run server
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    