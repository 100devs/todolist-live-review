const express = require ('express') //express is a dependencies package, less middleware
const app = express () // created an app variable with express function to allow to talk to server faster, aka automagical
const MongoClient = require('mongodb').MongoClient // connecting to your mongodb
const PORT= 4000
require('dotenv').config()

let db, //creating a db variable
 dbConnectionStr = process.env.DB_STRING, // shows dbstring
 dbName = 'todo' //making the db name

 MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //I don't know what useUnifiedTopology: true, leon said it doesn't get errors in mongodb
    .then(client => {  //client is holding the connection which .then trigger to talk to the client
        console.log(`Hey, connected to ${dbName} database`) //let us know which db it is being connected to
        db = client.db(dbName) //the connection will be in the db variable. to make the code more streamlined and lets typing
    })
    .catch(err => { //to catch something : i dont know exactly what
        console.log(err) //showing on the console a error message when error occurs
    })

 //setting up the server    
app.set('view engine', 'ejs') //to set up using the ejs file
app.use(express.static('public'))//setting up the server, don't need another route, it will serve it up using js 
app.use(express.urlencoded ({extended:true})) // i don't know what extended  but get the info from the form
app.use(express.json()) //to grab info from the file

app.get('/', async(req, res) =>{ //making a cleaner code using aysnc when adding the completed to do list
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments(
        {completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})


//whatever the action in the ejs is, is the name of the post
app.post('/createTodo',  (req, res) =>{
    // console.log(req.body.todoItem) //req.body.todoItem is grabbing info from the index.ejs form's name. just want info on that input
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //key is todo and the value is todoItem, the insertOne METHOD allows to insert document inside the todos collection with 2 properites
    .then (result => { //i dont know where the results is coming from, i think its from the form
        console.log('Todo has been added!')
        res.redirect('/') //refreshing the page
    })
} ) //start off not completed on the list because the task is not completed

app.put('/markComplete',(req,res)=>{ //a fetch request to update the list
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, { //update one document that matches and update that list
        $set:{ //I don't know, a function for express
            completed: true //
        }
    })
    .then(result =>{ //other part of the fetch
        console.log('Marked Complete') //showing message in console
        res.json("Marked Complete") // i dont know but somewhere in json its marked complete
    })
})

app.put('/undo',(req,res)=>{ //a fetch request to update the list
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, { //update one document that matches and update that list
        $set:{ //I don't know, a function for express
            completed: false //set the document back to false
        }
    })
    .then(result =>{ //other part of the fetch
        console.log('Marked Undo') //showing message in console
        console.log(req.body.rainbowUnicorn)
        res.json("Marked Undo") // i dont know but somewhere in json its marked complete
    })
    .catch(err => { 
        console.log(err) //showing on the console a error message when error occurs
    })
})

app.delete('/deleteTodo', (req,res)=>{ //hearing the fetch
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn}) //goes to db collections and delete one docuement under rainbowUnicorn
    .then(result => { //this is a fetch
        console.log('Deleted Todo')
        res.json('Deleted It') //response to the fetch
    })
})
app.listen(process.env.PORT || PORT, () => { //opens a port to communicate with the server
    console.log(`Server is running, you better catch it!`) //logging and showing message when server is connected
} )


//hot garbage call back pyramid of doom
// app.get('/', (req,res) => { //below is the callback when app is reading aka app.get //on the main route
    // db.collection('todos').find().toArray() //creaing find and array METHOD to find in the collection and put it in a array
    // .then(data => { //data is the array that was recieved from the database
        // res.render('index.ejs', {zebra: data, left: itemsLeft}) //hearing the request and serving up the ejs file, everytime see zebra mean there's data aka array
    // })
// })