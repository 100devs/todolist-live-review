//declare express and require express npm package
const express = require('express')
//declare app variable sets it equal to express function
const app = express()
//decalre MongoClient and requires mongodb npm package
const MongoClient = require('mongodb').MongoClient
//decalre PORT and sets it to 2121
const PORT = 2121
//zero-dependency module that loads environment variables from a . env file
require('dotenv').config()

//declares variable to be used in your DB connection
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connection to a single db, sets useUnifiedTopology to true
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//the handling of the fullfillment or rejection 
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        //sets db to instance of your db
        db = client.db(dbName)
    })
    //catching the rejection/error
    .catch(err =>{
        console.log(err)
    })

//view engine setting determines the file extension
app.set('view engine', 'ejs')
//tells express to look for static files in the public folder
app.use(express.static('public'))
//Returns middleware that parses both json and urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//a get request to the homepage
app.get('/', async (req,res)=>{
    //sets variable which find items in your collection and puts them in an array
    const todoItems = await db.collection('todos').find().toArray()
    //sets variable which hold the number of items that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //compiles template and send object of data previously collected
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//post method route
app.post('/createTodo', (req, res)=>{
    //a collection method to insert the data passed
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //promise handler for a success
    .then(result =>{
        console.log('Todo has been added!')
        //redirects/refreshes homepage
        res.redirect('/')
    })
})
//update method
app.put('/markComplete', (req, res)=>{
    //a collection method to update the data your passing
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //operator replaces the value of a field with the specified value
        $set: {
            completed: true
        }
    })
    //promise handler for success
    .then(result =>{
        console.log('Marked Complete')
        //responds so that the client treats the response string as a valid JSON object
        res.json('Marked Complete')
    })
})

//update method
app.put('/undo', (req, res)=>{
    //a collection method to update the data your passing
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //operator replaces the value of a field with the specified value
        $set: {
            completed: false
        }
    })
    //promise handler for success
    .then(result =>{
        console.log('Marked Complete')
        //responds so that the client treats the response string as a valid JSON object
        res.json('Marked Complete')
    })
})
//delete mothod
app.delete('/deleteTodo', (req, res)=>{
    //a collection method to delete the data your passing
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //promise handler for success
    .then(result =>{
        console.log('Deleted Todo')
        //responds so that the client treats the response string as a valid JSON object
        res.json('Deleted It')
    })
    //logs error if any
    .catch( err => console.log(err))
})
 //starts a server to listen to the env variable PORT or 2121 
app.listen(process.env.PORT || PORT, ()=>{
    //logs to show you're server is up and running
    console.log('Server is running, you better catch it!')
})    