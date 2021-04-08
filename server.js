//we set an express variable to require express
const express = require('express')
//ser an app variable that uses the express functionalities
const app = express()
//set a mongo variable that utilizes mondo db functionality
const MongoClient = require('mongodb').MongoClient
//set a port variable with out chosen port number
const PORT = 2121
//this allows us to use the dotenv functionality, which keeps important items private, make sure to put env file in git ignore so it does not get pushed to github
require('dotenv').config()

// create a variable that stores a path to link to our database
//I DONT KNOW  why we use a comma after db
let db,
    //db string is our url for the database. this is hidden in our dot env
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
})

app.post('/createTodo', (req, res) => {
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo has been added!')
            res.redirect('/')
        })
})

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

app.delete('/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
        .then(result => {
            console.log('Deleted Todo')
            res.json('Deleted It')
        })
        .catch(err => console.log(err))
})

app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!')
})