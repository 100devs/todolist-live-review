const express = require('express') // Requiring express
const app = express() // telling code when we use app to use express methods
const MongoClient = require('mongodb').MongoClient //requireing MongoClient when we use that variable
const PORT = 2121 // setting our port to 2121, telling the code when we use PORT to use that variable.
require('dotenv').config() //requiring dotenv

let db,
    dbConnectionStr = process.env.DB_STRING, // telling code where to get the connection string for the DB when we use dbConnectionStr
    dbName = 'todo' // telling our server what to use when it sees dbName

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // connecting to MongoDB using the previously defined connection string
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) // Visual cue that we've connected to the database
        db = client.db(dbName) // telling the server to redefine db to the database it finds with the name we defined earlier.
    })
    .catch(err =>{
        console.log(err) // console logging any error we throw up in the connection.
    })

// Middleware
app.set('view engine', 'ejs') // telling our server to render .ejs files
app.use(express.static('public')) // telling express to pul our static files from 'public' folder
app.use(express.urlencoded({ extended: true })) // parses URLEncoded requests
app.use(express.json()) // parses incoming JSON files

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray() // finding the database entries and putting them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts documents that are marked as false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //renders these in the index.ejs file
})

app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //adds the user's input to the database, auto marking complete to false
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/') // reloads the page
    })
})

app.put('/markComplete', (req, res)=>{ // creates path for API to update the complete field
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // searches for the clicked task
        $set: {
            completed: true // updates the complete to "true"
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete') // sends the result to main.js as JSON
    })
})

app.put('/undo', (req, res)=>{ // sets path to undo complete on click
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // searches for the clicked task in the database
        $set: {
            completed: false // sets complete to false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete') // sends response to main.js as JSON
    })
})

app.delete('/deleteTodo', (req, res)=>{ // sets path for deleting a task
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // searches for the task in the database
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It') // sends the delete to the main.js as JSON
    })
    .catch( err => console.log(err)) // catches any errors
})
 
app.listen(process.env.PORT || PORT, ()=>{ // makes the server listen for requests on the port specified by Heroku or the default port set earlier
    console.log('Server is running, you better catch it!') // visual cue that the server is running successfully. 
})    