const express = require('express') // needed to get express working
const app = express() // app now holds express() -- this acts like a method?
const MongoClient = require('mongodb').MongoClient // gets database to connect
const PORT = 2121 // this is the local port number
require('dotenv').config() // this will require .env's configuration

let db, // declaring db variable, this holds client.db(dbName)
    dbConnectionStr = process.env.DB_STRING, // dbConnectionStr is holding the info that points to the .env file with the database string
    dbName = 'todo' // 'todo' is the name of the database

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // I think this is telling MongoClient.connect to use specific strings -- don't really know what useUnifiedTopology is
    .then(client => { // stil trying to wrap around how then works
        console.log(`Hey, connected to ${dbName} database`) // console logging so we can see what's happening 
        db = client.db(dbName) // db is holding client.db(dbname)
    })
    .catch(err =>{ // the catch is what's used in case the .then fails, yeah?
        console.log(err) //shows us what err would be
    })

app.set('view engine', 'ejs') // this tells app to looks at these two files?
app.use(express.static('public')) // tells app to use express found in static?
app.use(express.urlencoded({ extended: true })) // not sure what this does
app.use(express.json()) // this parses express info into JSON

app.get('/', async (req,res)=>{ // points to the '/' directory or folder but still not clear about async and how it works
    const todoItems = await db.collection('todos').find().toArray() // todoItems is holding awais (which I'm not clear about really) while findind collections and adding them to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // itemsLeft is holding awais (which I'm not clear about really) while findind collections and adding them to an array
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // res.render... renders index.ejs to something readable
})

app.post('/createTodo', (req, res)=>{ // post will post info on /createTodo
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //this adds info into the 'todos' collection 
    .then(result =>{ // still not too clear about .then
        console.log('Todo has been added!') // let's us see what happens
        res.redirect('/') // this is going to redirect the response
    })
})

app.put('/markComplete', (req, res)=>{ // this put will move into to the markComplete folder
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // this updates the 'todo's by one collection/input and sends it to... rainbowUnicorn?
        $set: { // sets something for us?
            completed: true // returns true if it's true?
        }
    })
    .then(result =>{ // still not sure
        console.log('Marked Complete') // let's us see what's going on
        res.json('Marked Complete') // parses response into JSON
    })
})

app.put('/undo', (req, res)=>{ // puts info into /undo 
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // accesses the collection 'todos' and updates it with one piece of info
        $set: { // sets something for us?
            completed: false // returns false if it's false?
        }
    })
    .then(result =>{ // still not too clear about .then
        console.log('Marked Complete') // let's us see what's going on
        res.json('Marked Complete')  // parses response into JSON
    })
})

app.delete('/deleteTodo', (req, res)=>{ // deletes info in the /deleteTodo
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // deletes one item from the todos collection
    .then(result =>{  // still not too clear about .then
        console.log('Deleted Todo') // let's us see what's going on
        res.json('Deleted It')  // parses response into JSON
    })
    .catch( err => console.log(err))  // let's us see what's going on
})
 
app.listen(process.env.PORT || PORT, ()=>{ // sets up a listener to listen to a PORT that we declared earlier
    console.log('Server is running, you better catch it!') // let's us see what's going on here
})    