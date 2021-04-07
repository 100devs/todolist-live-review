//importing express middleware
const express = require('express')
//creating a const of app in order to use express middleware
const app = express()

//setting up our mongo database. We are pretty much importing mongo modules and tying them to const MongoClient
const MongoClient = require('mongodb').MongoClient

//setting up our local port for testing and development
const PORT = 2121

//importing dotenv in order to hide our mongoDB string 
require('dotenv').config()


//setting up variables for Mongo Db, this will allow us to use shorter commands on server.js
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


//Esablishing our connection with the server. We use Mongo method of connect, we direct it to tie to our DB string .   
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

//using Express to utilize our ejs file (not sure exactly)
app.set('view engine', 'ejs')

//using Express to allow access to the client side files found in our public folder
app.use(express.static('public'))

//No clue, but seems important
app.use(express.urlencoded({ extended: true }))

// something something convert data to json format
app.use(express.json())


//our root file. It loads our EJS file. when we "location.reload()" in our main.js, this function fires.
app.get('/', async (req,res)=>{
    //goes into Mongo and finds four documents located in database todos and puts them in an array
    const todoItems = await db.collection('todos').find().toArray()
    //makes sure the completed: false is the default (unsure)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders the data that was pulled from the database into our index.ejs file found in our public folder
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
// this function allows us to create a to do item from the form. It inputs that item into our mongoDB. the C in (CRUD)
app.post('/createTodo', (req, res)=>{
    //telling the database to take the data from the form in our ejs and CREATE a new document in our database.
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //console log that we succesfully created new entry in our data base and redirect us to our root file/"homepage". (this fires the app.get seen above)
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
//receives the put request from main.js function markComplete()
app.put('/markComplete', (req, res)=>{
    //here we are saying, go to our database in mongo named "todos" use the method to update the key value pair from todo using the data stored in the body of rainbowUnicorn (from ejs)
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //Set seems to be a MongoDB method that allows us to update documents found in our database, in this case we are updating "completed" from false to true
        $set: {
            completed: true
        }
    })
    //here we are saying to log the action as completed on the console log and then also pass it as completed in json form (maybe?)
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})


//this function allows us to update (The U in CRUD) our li text from completed true to false. Since it's set to false as a default, this function only fires if the li from ejs has a completed: true established (found in Mongo)
app.put('/undo', (req, res)=>{
    //look into MongoDB named todos, update the data base using the body request triggered by ejs (which is tied to main.js) and set completed as false
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    //tell us it's successful and return data in json format
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//The D in CRUD - this allows us to delete li found in the ejs (but really deletes in Mongo). It is triggered by clicking "delete" in the client side ejs. (which in turn triggers main.js)
app.delete('/deleteTodo', (req, res)=>{
    //look for collection 'todos' find and delete one that matches our body data from ejs
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //update databased and return as json
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 

//Use express to establish connection to server. process.env.PORT is the port provided by the hosting server, wheres PORT is from out local machine.
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    