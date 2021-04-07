// here we are bringing in some extra packages that will help us
// require says, hey bring in this package i installed earlier, to this file.
const express = require('express')
const app = express() 
const MongoClient = require('mongodb').MongoClient
const PORT = 2121 // this port is for the late savage only. 
require('dotenv').config() // this lets us use dot env to store our secret recipes 

// here we are setting up the path to our database, so we can connect to it and send it info.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' 
// this connects us to our database, console logs hey connected to <dbName>
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName) // this will store our new connetion into db
    })
    .catch(err =>{
        console.log(err) // any errors? this should log them
    })

app.set('view engine', 'ejs') // this is saying heyo, we are using ejs to render the 'view' into html form to the browser
app.use(express.static('public')) // magical line 17, allows us to put all our static files in one spot making for much cleaner code and easy access to them
app.use(express.urlencoded({ extended: true })) // need this for app to work, i think this is related to body parser. 
app.use(express.json()) // same as above, put it in to avoid the errors

// this is our create request. it will grab the root '/', look into our collection of todos in our database, find them all, put them into an array for easy iterations. second const counts all the documents in our collection with the completed value of false. last line res.render will take the response of our async function (which is the rendering of our ejs file and the amount of items left) and send it back to client as html
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// this is when the user fills out the form. and then adds the item to our database with the completed value of false, also it refreshes, so that will trigger our ^ get request again, which will re render the html with new info from DB
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

// here is our update request. if this function fires, it will go to our DB, and change a value. in this case it looks for a completed property in our collection, then it will set it to true. rainbowUnicorn came from our client side js. we have set rainbowUnicorn as the property of what the user has entered, allowing us to target it and change it accordingly
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
// this will reverse ^ allowing us to change a todo from complete to uncomplete
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
// just allows us to delete an item from list by using the deleteOne method (from express i think..)
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
// here we are telling express to listen on either port. always need this 'listen' and keep it at the bottom
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    