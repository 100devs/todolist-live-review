const express = require('express') // import express
const app = express() // assign express to app
const MongoClient = require('mongodb').MongoClient // import mongodb
const PORT = 2121 // hardcoded test port
require('dotenv').config()  // import dotenv

let db, // init variables
    dbConnectionStr = process.env.DB_STRING, // get db string from hidden .env file
    dbName = 'todo' // name of the collection

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // no one knows what topology is
    .then(client => { // hope my promise comes through
        console.log(`Hey, connected to ${dbName} database`) // a console.log
        db = client.db(dbName) // the db is now saved in the db variable!
    }) //close bracket
    .catch(err =>{ //my promise didn't come thru!
        console.log(err) // "What happen?!"
    }) // close bracket

app.set('view engine', 'ejs') // middleware time, tell express you're using ejs
app.use(express.static('public')) // pull in the public folder
app.use(express.urlencoded({ extended: true })) // i don't remember what this does
app.use(express.json()) // parse json responses

app.get('/', async (req,res)=>{ //create the default route!
    const todoItems = await db.collection('todos').find().toArray() // pull out the todo items and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count the number of entries marked not done, i think. i have never used countDocuments(). I assume it's a mongo method
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // send the stuff you pulled from the db to index.ejs and render the page
}) // close bracket

app.post('/createTodo', (req, res)=>{ // ahhh the post route, for adding a new entry to the db
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})  // make a new db entry with completed set to false and todo set to whatever you put in the field that i assume is on the page (i have not looked at the ejs file yet, i started with server.js)
    .then(result =>{ // promisessss
        console.log('Todo has been added!') // a console.log
        res.redirect('/') // send me back to that default get route!
    }) // close bracket
}) // close bracket

app.put('/markComplete', (req, res)=>{ // oooo, an update route!
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // i hate how you name variables leon it is not useful :(
        $set: { // i have no idea what this syntax is ...
            completed: true // but i know you're changing completed from false to true
        } // close bracket
    }) // close bracket
    .then(result =>{ // promisessssss
        console.log('Marked Complete') // console log
        res.json('Marked Complete') // i'm not clear on where this alert actually gets sent. i think maybe the user side console?
    }) // close bracket
}) // close bracket

app.put('/undo', (req, res)=>{ // another update route!
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // just the markcomplete route in reverse, this doesn't feel very DRY but i dont know how you fix that
        $set: { // weird syntax again
            completed: false // mark uncomplete
        } //close bracket
    }) // close bracket
    .then(result =>{ // i'm wondering if technically all these routes need error handling
        console.log('Marked Complete') // it seems like they should
        res.json('Marked Complete') // but i'm not an expert
    }) // close bracket
}) // close bracket

app.delete('/deleteTodo', (req, res)=>{ // mandatory delete route so it counts as a CRUD app
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // what is rainbowUnicorn
    .then(result =>{ //this one has error handling
        console.log('Deleted Todo') // console log
        res.json('Deleted It') // not a console log
    }) // close bracket
    .catch( err => console.log(err)) // error handling!
}) // close bracket
 
app.listen(process.env.PORT || PORT, ()=>{ // process.env.PORT is how you connect to an app deployed on heroku, || PORT falls back to the port defined at the top if you are testing in your dev environment
    console.log('Server is running, you better catch it!') // ha ha
})    // close bracket