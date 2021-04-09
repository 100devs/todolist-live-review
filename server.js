//// heavily commented for #100DEVS!
const express = require('express') //we installed express, so we need to require it to make its methods visible to this file
const app = express() //invoking express and setting it to app to make it easier to work with
const MongoClient = require('mongodb').MongoClient //we installed mongodb so we need to require that too so we can access the mongo client
const PORT = 8000 //local port defined

require('dotenv').config() //makes it possible to use env variables. currently using only for the connection string on line 10. 

let db,   //declare var db - eventually holds db
    dbConnectionStr = process.env.MONGO_STR, //declare var dbConnectionStr which are my creds to connect to the database, variable MONGO_STR which is set in my .env file
    dbName = 'todo' //declaring a var which holds the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //mongo connection. connect method takes in the string and an object which sets useUnifiedTopology to true. Idk what useUnifiedTopology is
    .then(client => { //connect must be a promise! when it resolves, we get data back and call it client & pass it into a function
        console.log(`Connected to ${dbName} database`) //logging the database name to the console on the server so we know it connected
        db = client.db(dbName) //this is saying db from line nine will hold the connection? to the database called 'todo'
    }) //close the .then function block and close the .then
    .catch(err => console.error(err)) //if there are errors, console error them

//all of this is middleware - does stuff between the request and the response
app.set('view engine', 'ejs') //using express' .set method to set the view engine to ejs - our templating language
app.use(express.static('public')) // using express' use method to serve files in the public folder as static files on the client side
app.use(express.urlencoded({ extended: true })) //not sure exactly what this is, but it makes the request data that is sent with request from the client side more readable (like form data)
app.use(express.json()) //also not sure but must have to do with the JS being able to use json files or something

app.get('/', (req, res) => { //we are creating a way for server.js to listen for get requests - get method takes in a string and a callback function, which itself takes in arguments for the request data that comes from the client, and the response that will be sent when the promise resolves?
    db.collection('todos').find().toArray() //find the collection todos in the database, find all the documents, make them into an array
    .then(data => { //when that's done, take the data that comes back and pass it into a function
        // console.log(data) //console log it to see what it is for funsies
        res.render('index.ejs', {arrayOfItems: data}) //take the response and give it an ejs file along with an object that contains the data that the ejs file needs ('arrayOfItems' holds the array from line 27)
    }) //close the function from the .then
    .catch(err => console.log(err)) //if there are errors, console log them
}) //close the callback function and the get method

app.post('/createTodo', (req, res) => {  //another request, this time using the post method - route is createTodo and fires a callback with two parameters req and res, when server hears the route
    const item = req.body.todoItem.trim() //doing this to prevent spaces at the ends of items submitted... this is the text submitted input with the name 'todoItem'.
    const date = req.body.userDate //this is storing a date variable that is hidden and sent with the form submission - defined in index.ejs. Not rendered anywhere on the user end for now
    db.collection('todos').countDocuments({ todo: item }, { limit: 1 }) //counting to see if the item already exists in the db - limiting to only 1
        .then(result => { //then take the response
            if (!result) { //check if num is 0. if it's 1, it's in the db. if it's 0, it's not
                db.collection('todos').insertOne({ todo: item, dateAdded: date, completed: false }) //add one document to the database collection todos, which contains three properties: todo, dateAdded, and completed. Set those values to the input text, the current date from the Date object, and false
                .then(result => { //then take that result, create a function that takes it as a parameter/argument
                    // console.log(result) //console log it for fun
                    console.log('Todo item has been added') //console log a message that it has been added
                    res.redirect('/') //refresh to the root
                }) //close the .then function and .then call
            } else { //otherwise
                console.log(`"${item}" already exists in the database`) //log the item that is already in the database
                res.redirect('/') //refresh to root
            } //close else block
        }).catch(err => console.log(err)) //log errors
}) //close the post request

app.delete('/deleteTodo', (req, res) => { //this time it's a delete we're setting up - route /deleteTodo and a callback func
    db.collection('todos').deleteOne({todo:req.body.clickedText}) // go to database, find collection 'todos', using mongo deleteOne method delete One item that matches the clicked Text... which is set up in main.js on line 25
    .then(result => { //when promise resolves, fire then with an argument that is the result
        console.log('Deleted Todo Item') //log to server that an item has been deleted
        res.json('Deleted Todo Item') // send back to fetch so client gets response that it has been deleted too
    }) //close the function and the then
    .catch(err => console.log(err)) //log any errors
}) //close delete request

app.put('/markComplete', (req, res)=>{  //call put method on express whick listens for a request from markComplete, fires a callback when it does
    db.collection('todos').updateOne({todo: req.body.itemToMark}, { //go to the database collection 'todos' and use mongo's updateOne method that matches what is passed in as an object - here it's an item with the 'todo' property which holds a value equal to an 'itemToMark' property which comes with the client request. defined on line 49 of main.js, then we pass in another object
        $set: { //set is an operator that comes with mongo I think - we are setting 
            completed: true  //the completed property on itemToMark to true
        } //close the $set object
    }) //close 
    .then(result => {
        console.log('Marked complete')
        res.json('Marked complete')
    })
})
// this is an Easter Egg. If you have read this far through this horrendously commented code, I applaud you. Feel free to tweet 'cinnamon bun' or 'potato chip' to @belancrawford to let me know! I'll accept messages, too :)
app.put('/undoComplete', (req, res) => { //another put request!! this time at /undoComplete
    db.collection('todos').updateOne({ todo: req.body.itemToUndo }, { //does the same as line 64 but matches item to undo - line 65 of main.js
        $set: { //set operation - set the matched object's
            completed: false //completed property to false. 
        } //close set
    }) //close 2nd parameter/object and the updateOne method call
        .then(result => { //thennnn the result that comes back, pass it into a function... didn't do anything with it
            console.log('Item marked not complete') //log it to the console
            res.json('Item marked not complete') //but we did send a promise back 'item marked not complete' to the client using res
        }) // close then and its function that we passed in
}) //close .put()'s callback function and closing paren for put method

app.listen(PORT, () => { //OK now here is where the server is set up to listen on PORT 8000 from line 5. When it stars listening, it fires a callback function
    console.log(`Server is running, you better catch it`)  //it will fire the function, logging this to the console, which will make you laugh
}) //close the .listen() callback function, close the .listen() method