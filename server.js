const express = require('express')//variable set to require the express module
const app = express()//variable set to run express - this allows us to run express without having to type express() everytime
const MongoClient = require('mongodb').MongoClient//variable set to mongodb database package
const PORT = 2121//variable that sets our localhost port
require('dotenv').config()

let db,//variable that holds entire database
    dbConnectionStr = process.env.DB_STRING,//variable that holds connection string used for mongo atlas
    dbName = 'todo'//variable set to our database name

//promise 
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})//connect method for MongoClient. sends connection string and unifiedtopology object, which removes deprecation warning

    //then resolves if database connects
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)//alerts that we are connected to database in the console
        db = client.db(dbName)//connection is stored in db variable
    })
    //throws an error if database cannot connect
    .catch(err =>{
        console.log(err)//error is stored in the console
    })

app.set('view engine', 'ejs')//sets the view engine which allows us to use ejs files
app.use(express.static('public'))//server can use anything in the public folder to serve up
app.use(express.urlencoded({ extended: true }))//allows us to full info from the form into the request
app.use(express.json())//uses info from form and stores as json

//when server hears a get request ('/'), fires a function
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//responds with index.ejs file
})

//adds todo item to db
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})//adds item from body of todoItem and sets completed to false
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')//redirects to home page if successful
    })
})

//updates completed to true in database
app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//looks for an object that matches
        $set: {
            completed: true//sets completed to true if object matches
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')//json response
    })
})

//updates completed to false in database
app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//looks for an object that matches, 
        $set: {
            completed: false//sets completed to false if object matches
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')//json response
    })
})


//deletes todo item from database
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})//passes in an object that matches, if match, object gets deleted
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')//json response
    })
    .catch( err => console.log(err))//error response
})
 
//starts the server
app.listen(process.env.PORT || PORT, ()=>{//takes in the port and has a callback when it connects
    console.log('Server is running, you better catch it!')//stores message in the console that server is up and running
})    