//requiring the express module
const express = require('express')
//assigning the app variable to the express function
const app = express()
//assigning global variable MongoClient to MongoClient property of required module 'mongodb'
const MongoClient = require('mongodb').MongoClient
//declaring the port for server
const PORT = 2121
//requiring dotenv module with config method
require('dotenv').config()

//declaring database variable without defining
let db,
    //database connection string comes from process object's env property's DB_STRING property
    dbConnectionStr = process.env.DB_STRING,
    //name the database name 'todo'
    dbName = 'todo'

//connect to the mongodb client with the connections tring, and specify use of unified topology (is this syntax??)
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    //once this is done, chain a then with argument client
    .then(client => {
        //log that we are connected to the database
        console.log(`Hey, connected to ${dbName} database`)
        //define db as the database we are connected to
        db = client.db(dbName)
    })
    //if this fails, catch the error and log it
    .catch(err =>{
        console.log(err)
    })

//set the view engine as ejs?
app.set('view engine', 'ejs')
//make the static pages public
app.use(express.static('public'))
//no idea what this does
app.use(express.urlencoded({ extended: true }))
//make the app use the express module with JSON notation?
app.use(express.json())

//define the get request for when page is loaded, takes request and response parameters for async second parameter
app.get('/', async (req,res)=>{
    //declare an array from the todo documents in database
    const todoItems = await db.collection('todos').find().toArray()
    //count the documents which have the completed property with value false and assign to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the todoItems and itemsLeft arrays as variables 'zebra' and 'left'  into the ejs template file
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//define the post request for when items are added, takes parameters the path 'createTodo', and request and response parameters; not async
app.post('/createTodo', (req, res)=>{
    //insert a todo item into the documents in the database with property completed set to false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //when this is done, take the completed promise (?) and chain a .then
    .then(result =>{
        //console log that the todo was added
        console.log('Todo has been added!')
        //reload the page -> get request!
        res.redirect('/')
    })
})

//define the put request for marking items as complete, aka changing a property; not async
app.put('/markComplete', (req, res)=>{
    //use the updateOne method on the database todo collection with req same as parameter
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //set this property to true
        $set: {
            completed: true
        }
    })
    //chain .then to completed method call
    .then(result =>{
        //console log that the todo item was completed
        console.log('Marked Complete')
        //set json property of res parameter to 'marked complete'
        res.json('Marked Complete')
    })
})

//define put request for undoing a completed todo item, not async
app.put('/undo', (req, res)=>{
    //use updateOne method on body.rainbowUnicorn property of req parameter
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //set this property to false
        $set: {
            completed: false
        }
    })
    //chain a .then with the result of that completed method call
    .then(result =>{
        //log it as complete
        console.log('Marked Complete')
        //set json property of res parameter to 'marked complete'
        res.json('Marked Complete')
    })
})

//define delete request for deleting a todo item completely from list ; not async
app.delete('/deleteTodo', (req, res)=>{
    //go into the collection 'todos' and call the deleteOne method on body.rainbowUnicorn property of req parameter
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //chain a .then to the result of that completed method call
    .then(result =>{
        //console log that the item was deleted
        console.log('Deleted Todo')
        //assign the json property of res parameter to 'deleted it'
        res.json('Deleted It')
    })
    //if the delete didn't complete, log the error
    .catch( err => console.log(err))
})

//call the listen method on the whole app, and if a port is open, aka server is running, log The Joke
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})
