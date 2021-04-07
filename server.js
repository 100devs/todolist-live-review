const express = require('express') // Common JS way to import this one is importing the express module
const app = express() // This is setting a variable app to express so i can use express easier
const MongoClient = require('mongodb').MongoClient // Connects this app to mongo module and all of its goodies
const PORT = 2121 // Sets the port variable to 2121 after Sir Savge himself
require('dotenv').config() // imports the dot env module which we use to hide our mongo string 

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' // this block declares our connection string and names a database it also declares db for later use

MongoClient.connect(dbConnectionStr, { // this connects us to our mongo database 
        useUnifiedTopology: true // this is magic 
    })
    .then(client => { // this connect is an async function so we gotta define what to do next 
        console.log(`Hey, connected to ${dbName} database`) // console log so we can see we are connected to the proper database
        db = client.db(dbName) // we are defining our previously declared (line7) variable with our db connection
    })
    .catch(err => {
        console.log(err) // error catching async stuff
    })

app.set('view engine', 'ejs') // next 5 lines are middleware this one allows us to make a views folder where we can drop ejs into and our app will use it(basically client side shenanigans)
app.use(express.static('public')) // this magics us some assets we can use in our views   
app.use(express.urlencoded({ // body parser for url encoded things
    extended: true
}))
app.use(express.json()) //body parser for json things

app.get('/', async (req, res) => { // this gets objects from our db collection 
    const todoItems = await db.collection('todos').find().toArray() // finds objects in there(right now all objects because no find parameter exists) and send them into an array for the glorious methods they provide
    const itemsLeft = await db.collection('todos').countDocuments({ // we use this to make a counter in our client side/ basically counts all objects with the completed property with the value of false
        completed: false
    })
    res.render('index.ejs', { // love this one, it sends all the data to our views/index.ejs for use as objects
        zebra: todoItems, // this is the array of all todos objects
        left: itemsLeft // this is the number of objects where completed === false
    })
})

app.post('/createTodo', (req, res) => { // our post 
    db.collection('todos').insertOne({ // inserting a new object
            todo: req.body.todoItem, // the value of the todo property in our new object is the requests body(the input from the form)
            completed: false // auto sets the value of false to a new object beacuse the task has not been completed if you are adding it to a to do list
        })
        .then(result => { //async shit
            console.log('Todo has been added!') // first a log so we can see somethings been added
            res.redirect('/') //reloads the root(also only) page of our app
        })
})

app.put('/markComplete', (req, res) => { //put we use to mark something completed
    db.collection('todos').updateOne({ // we are updating a todo
            todo: req.body.rainbowUnicorn // some wild ass variables here but, rainbowUnicorn(from main js) is holding the name of the to do we are searching the data base collection for
        }, {
            $set: {
                completed: true // we are setting the value of the completed key to true 
            }
        })
        .then(result => { // async shit
            console.log('Marked Complete') // log for us to see 
            res.json('Marked Complete') // json for us NOT REALLLY SURE
        })
})

app.put('/undo', (req, res) => { // another put this time resetting out completed value to false 
    db.collection('todos').updateOne({
            todo: req.body.rainbowUnicorn // same as above holds todo name that we are searching for in the db collection
        }, {
            $set: {
                completed: false // sets the completed value to false 
            }
        })
        .then(result => { //async
            console.log('Marked Complete') //log for us
            res.json('Marked Complete') //IM NOT SURE
        })
})

app.delete('/deleteTodo', (req, res) => { // deleteing
    db.collection('todos').deleteOne({ // searches our db for the object with the todo property with the value that is currently stored in rainbowUnicorn
            todo: req.body.rainbowUnicorn
        })
        .then(result => {
            console.log('Deleted Todo')
            res.json('Deleted It')
        })
        .catch(err => console.log(err)) // error catching
})

app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!') // tells express to listen to a PORT the process.env.PORT is heroku related, the PORT is 2121 because we declared it that way
}) // this is our server, our code is tlking to our browser and showing us(or the client) what we tell it here, in views, or in public