//allow to use express 
const express = require('express')
//create variable with express function
const app = express()
//connecting to the mongo db database
const MongoClient = require('mongodb').MongoClient
//creating variable to host server localhost:3000
const PORT = 3000
//still confused on this 
require('dotenv').config()
//creating connections to the database
let db,
    dbConnectionStr = 'mongodb+srv://todolist:todolist@cluster0.rahjv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    dbName = 'todo'

    //connecting the mongo client to our database using promise
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        //console.log to see if we are connected
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    //error if not connected correctly
    .catch(err =>{
        console.log(err)
    })

    //express access to ejs file
app.set('view engine', 'ejs')
//gives express access to our public file
app.use(express.static('public'))
//not sure about this line
app.use(express.urlencoded({ extended: true }))
//not sure on this line
app.use(express.json())
//get info from server with get
app.get('/', async (req,res)=>{
    //waiting for response from input
    const todoItems = await db.collection('todos').find().toArray()
    //checking to see if items complete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
//this is sending info from app back to database when the input has been fulfilled
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
//i think i know but i don't at the same time :)
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
//same as before but i think it is for the updating of the list
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
//delete portion of crud
app.delete('/deleteTodo', (req, res)=>{
    //deleting database
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 //letting us know if we are properly connected to the server
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    