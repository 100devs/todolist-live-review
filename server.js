const express = require('express'); // server
const app = express(); // makes it so you don't have to worry about typing express with ''
const MongoClient = require('mongodb').MongoClient
// using something specific that comes with Mongo and also allows us to connect to DB
const PORT = 2121
require('dotenv').config() // allows us to import db string from .env file - keeps db name and password hidden when pushed to heroku

// connect to db and make sure that it is working
let db, // holds db and ',' allows us to declare all variables at once
    dbConnectionStr = process.env.DB_STRING, // to connect to Mongo Atlas
    dbName = 'todo' // name of db

    // code we are going to use to connect to db
    MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //takes in connection string and another object so we dont get errors when trying to build our project
        .then(client => {
            // this will only fire once it resolves/connected
            console.log(`Hey, connected to ${dbName} database`) // connected to db
            db = client.db(dbName) // where we store the connection - db
        })
        .catch(err => {
            console.log(err) // if there is an error
        })

// SET UP SERVER
app.set('view engine', 'ejs') // app is set up to read ejs files
app.use(express.static('public')) // any static file that is put in public folder, server will serve it up
app.use(express.urlencoded({ extended: true })) // look at applications and request that are being sent, and pull info out of those request - ex. submitting form
app.use(express.json())

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// app.get('/', (req, res) => {
//     db.collection('todos').find().toArray() // going to find all todos and turn them into an array of objects
//     .then(data => {
//         // data from the array
//         res.render('index.ejs', {
//             zebra: data // calling the array of objects/data zebra - think of it as a key value pair
//         }) // server is going to here request then server up ejs file - need to create ejs file
//     })
    
// })

// route that hears post - what the action in ejs is
app.post('/createTodo', (req, res) => {
    // user makes post, then is heard by this route and one doc is collected
    db.collection('todos').insertOne({
        todo: req.body.todoItem, // creates document of whatever is put in the input on form submit
        completed: false, // this makes it so every todo that is initially added to the list wont be marked completed
    }).then(result => {
        console.log('Todo has been added!') // lets us know that we are doing stuff
        res.redirect('/') // redirects back to the main page
    })
})

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

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})   