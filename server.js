const express = require('express')//gives api access to express framework
const app = express()//initializes express object
const MongoClient = require('mongodb').MongoClient //gives api access to mongodb package
const PORT = 2121//sets port variable for use with local machine
require('dotenv').config()//configures use of environment variables, prevents hardcoding sensitive info directly into server api

//declaring variables for connecting to mongo database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //connects to mongodb using mongoclient
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)//if successful, log success message to console
        db = client.db(dbName) //sets db connected to mongo database
    })
    .catch(err =>{
        console.log(err) //if there's an error, logs to console
    })

app.set('view engine', 'ejs') //to use ejs to render html pages
app.use(express.static('public'))//allows for direct access to static pages like css, js, etc
app.use(express.urlencoded({ extended: true }))//parses incoming requests, acts as body parser
app.use(express.json())//allows receipt of json objects to server

app.get('/', async (req,res)=>{//on request to homepage
    const todoItems = await db.collection('todos').find().toArray()//find all documents in collection 'todos'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//counts all uncompleted documents in collection
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//generates an html file and passes objects to renderer file
})

app.post('/createTodo', (req, res)=>{//handles post requests from form
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})//parses and inserts a document into database
    .then(result =>{
        console.log('Todo has been added!')//success message is logged if successful
        res.redirect('/')//redirect to homepage after successful post
    })
})

app.put('/markComplete', (req, res)=>{//handles update requests
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//finds first document matching request
        $set: {//sets document variable to true
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')//logs success
        res.json('Marked Complete')//returns json object to client
    })
})

app.put('/undo', (req, res)=>{//handles update request
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//finds first matching document
        $set: {//sets document variable to false
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')//logs success
        res.json('Marked Complete')//returns json object to client
    })
})

app.delete('/deleteTodo', (req, res)=>{//handles delete request
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})//finds and deletes first matching document
    .then(result =>{
        console.log('Deleted Todo')//logs success
        res.json('Deleted It')//returns json object to client if successful
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{//sets port to environment variable OR local machine port
    console.log('Server is running, you better catch it!')//logs success
})    