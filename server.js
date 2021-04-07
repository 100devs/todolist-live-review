//Here is a list of all required packages and modules 
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//this section creates variables that are tied to the dotenv file for ease of use of coding the rest of the file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//this connects the server to the mongodb database which is used to store information
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

//this is telling express what to view for the view engine
app.set('view engine', 'ejs')
    //location of the folder
app.use(express.static('public'))
    //returns middleware that parse url encoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//points to main index file; creates an array to create/list items
//get is used to read or "get" something; 
app.get('/', async(req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
})

//post is used to make something; the res.redirect '/' is used to reload the page
app.post('/createTodo', (req, res) => {
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo has been added!')
            res.redirect('/')
        })
})

//put is used to update or change something
app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
            $set: {
                completed: true
            }
        })
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
})

//put is used again to update or change something but this is used to undo as compared to complete
app.put('/undo', (req, res) => {
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
            $set: {
                completed: false
            }
        })
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
})

//delete just deletes whatever it is you want to delete. 
app.delete('/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
        .then(result => {
            console.log('Deleted Todo')
            res.json('Deleted It')
        })
        .catch(err => console.log(err))
})

//used to bind and listen the connections on the listed port; 
app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!')
})