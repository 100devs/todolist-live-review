//bring in express
const express = require('express')
//put express method into app so we don't have to run everytime
const app = express()
//bring in MongoClient database
const MongoClient = require('mongodb').MongoClient
//our Port can be anything
const PORT = 2121
//bring in dotenv. config will parse the file and return object
require('dotenv').config()

//declare db variable
let db,
    //declare variable to store our MongoDB url which was assigned in DB_STRING in .env
    dbConnectionStr = process.env.DB_STRING,
    //declare variable to store our documents in db
    dbName = 'todo'

//Connecting with our database and requesting data from it to see if it works
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

//tells express to use ejs template
app.set('view engine', 'ejs')
//our static files hosted in public directory
app.use(express.static('public'))
//allow express to get data 
app.use(express.urlencoded({ extended: true }))
//tells express data incoming will be json
app.use(express.json())

//first get request to our database for the homepage
app.get('/', async (req,res)=>{
    //looks for our todos in the mongo collection and puts it in array
    const todoItems = await db.collection('todos').find().toArray()
    //counts documents in db with false completed status
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders index.ejs with previous data
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//post request for our todo list
app.post('/createTodo', (req, res)=>{
    //create document in db for our task with false status
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        //notifies us and redirecs to homepage
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

//put request for our todo list
app.put('/markComplete', (req, res)=>{
    //updates our document in db to true completed status
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        //send json response back to client side
        res.json('Marked Complete')
    })
})

//put request so that we can change back to false completed status
app.put('/undo', (req, res)=>{
    //updates document in db to false status
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

//delete request for removing a task
app.delete('/deleteTodo', (req, res)=>{
    //deletes the document in db
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

//listen request to assign PORT to Heroku assigned PORT or our own
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})     
