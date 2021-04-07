//Import express
const express = require('express')
//Initialize an instance of express()
//this will be our server
const app = express()
//Import the MongoClient
const MongoClient = require('mongodb').MongoClient
//define the port that the server will listen to
const PORT = 2121
//import dotenv
require('dotenv').config()
//using .config() will parse the file and assign its contents process.env - returning an object

//declare the db variable
let db,
//declare dbConnectionString and assign it to our dbURI saved in the .env file
    dbConnectionStr = process.env.DB_STRING,
    //declare and assign the dbName: this is what our documents will be saved under
    dbName = 'todo'

//Connect to the database
MongoClient.connect(dbConnectionStr, 
//avoid a deprecation warning
{useUnifiedTopology: true})
    .then(client => {
      //console.log on connection
        console.log(`Hey, connected to ${dbName} database`)
        //assign the db
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
//tell express we're using ejs
app.set('view engine', 'ejs')
//tell express where our static files are (css, js)
app.use(express.static('public'))
//allow express to recieve form data in request.body
app.use(express.urlencoded({ extended: true }))
//allows express to parse incoming json data
app.use(express.json())

//request handler for GET '/'
app.get('/', async (req,res)=>{
  //assign a variable to the data recieved in the collection as an array using MongoClient 
    const todoItems = await db.collection('todos').find().toArray()
    //assign a variable to the items with the completed attribute equal to false using MongoClient 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the index.ejs file and pass through the data recieved
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})


//request handler for POST '/createTodo
app.post('/createTodo', (req, res)=>{
  //use MongoClient to insert a new document to the collection
  //req.body.todoItem will be the form data received
  //and we set the completed attribute to false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
      //on save console.log confirmation and redirect to the home page
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

//request handler for PUT '/markComplete'
app.put('/markComplete', (req, res)=>{
  //use MongoClient to find and update a specific document
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
      //set the completed property to true
        $set: {
            completed: true
        }
    })
    .then(result =>{
      
        console.log('Marked Complete')
        //send a json response to the client
        res.json('Marked Complete')
    })
})

//request handler for PUT '/undo'
app.put('/undo', (req, res)=>{
  //use MongoClient to find and update a specific document
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //set completed to false
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        //send a json response to the client
        res.json('Marked Complete')
    })
})


//request handler for DELETE '/deleteTodo'
app.delete('/deleteTodo', (req, res)=>{
  //use MongoClient to find and delete a specific document
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        //send json response
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
//set the PORT our server will listen on
//process.env.PORT is for heroku
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    