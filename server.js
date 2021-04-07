const express = require('express') //imports express module and assigns it to express variable
const app = express() //assigns express() function to variable app
const MongoClient = require('mongodb').MongoClient //imports mongoDB
const PORT = 2121 //asigns port for localserver
require('dotenv').config() //unknown

let db,
    dbConnectionStr = process.env.DB_STRING, //asigns the db connection string (located in env file) to dbconnectionstr
    dbName = 'todo' //names db

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) //console log successful DB connection
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err) //error log unsuccessful
    })

app.set('view engine', 'ejs') //middleware
app.use(express.static('public')) //allows free access to public folder
app.use(express.urlencoded({ extended: true })) //who knows
app.use(express.json()) //tells express to expect json

app.get('/', async (req,res)=>{ //gets root
    const todoItems = await db.collection('todos').find().toArray() //assigns all colletions to todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //assigns a numb to items left based on amount of uncompleted documents
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //renders the EJS whenever one goes to root directory, passes data.
})

app.post('/createTodo', (req, res)=>{ //adds new today using post
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //inserts one collection to DB, set as completed: false
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/') //redirects back to root
    })
})

app.put('/markComplete', (req, res)=>{ //makes a toDo complete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true //sets completed as true (default is false)
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{ //makrs completed toDo as uncomplete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false //sets completed as false
        }
    })
    .then(result =>{
        console.log('Marked Complete') //probably should say "Marked uncompleted"
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{ //deletes single collection from DB
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //deletes colletion found in req.body.rainbowUnicorn
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{ //telling server which port to run on 
    console.log('Server is running, you better catch it!')
})    