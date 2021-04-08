const express = require('express') //I don't know what this is
const app = express() //I don't know what this is
const MongoClient = require('mongodb').MongoClient //I don't know what this is
const PORT = 2121 //I don't know what this is
require('dotenv').config() //I don't know what this is

let db, //declaring variables, but I don't know what they do
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //I don't know what this is
    .then(client => { //I think "then" executes if a promise is resolved, but I don't understand this code
        console.log(`Hey, connected to ${dbName} database`) //print the string to the console. It includes a string literal, but I don't know where it's getting the info
        db = client.db(dbName) //I don't know what this is
    })
    .catch(err =>{ //I think "catch" executes if the promise fails to resolve, but I don't understand this code
        console.log(err) //print error to the console
    })

app.set('view engine', 'ejs') //I don't know what this is
app.use(express.static('public')) //I don't know what this is
app.use(express.urlencoded({ extended: true })) //I don't know what this is
app.use(express.json()) //I don't know what this is

app.get('/', async (req,res)=>{ //I think "get" would be the R in CRUD, but I don't understand this code or anything on the following three lines.
    const todoItems = await db.collection('todos').find().toArray() //
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //
})

app.post('/createTodo', (req, res)=>{ //I believe "post" would be the C in CRUD, but I don't understand this code or anything on the following four lines (except the console.log)
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{ //I think "put" would be the U in CRUD, but I don't understand this code or anything on lines 40-59 (except the console.log)
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

app.put('/undo', (req, res)=>{ //see comment on line 39
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

app.delete('/deleteTodo', (req, res)=>{ //I think "delete" is the D in CRUD, but I don't understand this code or anything on lines 64-69
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{ //I don't know what this is
    console.log('Server is running, you better catch it!') //prints the given string to the console
})    
