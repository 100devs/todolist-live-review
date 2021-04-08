const express = require('express') // make sure express is being used (after added to package.json)
const app = express() //taking express and running it
const MongoClient = require('mongodb').MongoClient //connect to db
const PORT = 2121 //Setting a Port
require('dotenv').config()

let db, //variable that holds entire database
    dbConnectionStr = process.env.DB_STRING, //string to connect to Mongo Atlas (String from Mongo Atlas site). Remember to add IP address (in Mongo).
    dbName = 'todo' //name

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //Code to connect to db (This is a promise).
    .then(client => { //Conection to client db
        console.log(`Hey, connected to ${dbName} database`) //To know we've connected to db
        db = client.db(dbName) //Store connection to db
    })
    .catch(err =>{
        console.log(err) //If server is running but not seeing connection
    })
//Set view engine, set to use ejs files
app.set('view engine', 'ejs')
//Server is going to use, look at information being sent, pull information.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Get Request. Go to db, get all the info, plug it into ejs.
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray() //Take all the docs and turn it into an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //How many things left to do
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //Response. Array of ojects from db
})

//Post Request
app.post('/createTodo', (req, res)=>{ //route from form action in ejs
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //Send info to db
    .then(result =>{ //Something has been added to the db
        console.log('Todo has been added!')
        res.redirect('/') //refresh to homepage
    })
})

app.put('/markComplete', (req, res)=>{ //route from markComplete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //match inside of batch
        $set: { //object with set property.
            completed: true
            //go to db, go to collection, update one doc that matches the text that was clicked on. Once the match is found, set it's completed property to true.
        }
    })
    .then(result =>{ //Updated
        console.log('Marked Complete')
        res.json('Marked Complete') //responding to fetch from client-side js
    })
})

app.put('/undo', (req, res)=>{ // route from undo
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false //false because undid the complete
        }
    })
    .then(result =>{
        console.log('Marked Complete')//Worked
        res.json('Marked Complete') //response
    })
})
//Delete Request
app.delete('/deleteTodo', (req, res)=>{ //route from async function deleteTodo(){}
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //body of deleteTodo(){}
    .then(result =>{
        console.log('Deleted Todo') //Worked
        res.json('Deleted It') //respond back (have to answer the fetch)
    })
    .catch( err => console.log(err))
})

app.listen(process.env.PORT || PORT, ()=>{ //Start Server
    console.log('Server is running, you better catch it!')
})
