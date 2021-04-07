//express package is being required to be used and stored in a variable
const express = require('express')
//express is being called and being stored in a variable
const app = express()
//requiring mongodb, using a library to set up the connection and storing in a variable
const MongoClient = require('mongodb').MongoClient
//setting up the port for access the server
const PORT = 2121
//setting up the dotenv package
require('dotenv').config()
//setting up variables for database, storing the connection string
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//setting up the connection to the database.
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//handling promise for the connection and launching a message on the console.
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    //catching possible errors
    .catch(err =>{
        console.log(err)
    })
//using the set method of express to set up the embedded JS
app.set('view engine', 'ejs')
//setting up the public folder
app.use(express.static('public'))
//setting up express middleware for requests
app.use(express.urlencoded({ extended: true }))
//setting up the json format for the data that is passing through
app.use(express.json())
//setting up get request for home page using async await
app.get('/', async (req,res)=>{
    //going to db, finding the docs, putting into arrays, storing on variable
    const todoItems = await db.collection('todos').find().toArray()
    //going to db, getting docs and counting all that match the specified key and value
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //responding with the rendering of the main ejs file and passing through some data
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
//setting up post request function
app.post('/createTodo', (req, res)=>{
    //go to db, insert one doc that match the data from the form
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //then console log a message and refresh the page
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
//setting up our update with put request
app.put('/markComplete', (req, res)=>{
    //go to db and update the doc that match the specific data
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //change the key value
        $set: {
            completed: true
        }
    })
    //then console log and send response in json format
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//setting up our update to enable the ability to reverse what we did
app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    //console logging and sending json response
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//setting up our delete function request
app.delete('/deleteTodo', (req, res)=>{
    //go to db, delete one that match the specified doc from the front end
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //then console log message and send json
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    //catch possible errors
    .catch( err => console.log(err))
})
 //setting up express to listen to requests in the specified port
app.listen(process.env.PORT || PORT, ()=>{
    //logging message
    console.log('Server is running, you better catch it!')
})    