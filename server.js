const express = require('express')//Adds express
const app = express()//A quicker way to consume express
const MongoClient = require('mongodb').MongoClient//Connects to the MongoDB database
require("dotenv").config();//Makes it so then we can link the .env file to this file without having to expose our mongo string
const PORT = 8000//http://localhost:8000/

let db, //Holds the entire database
  dbConnectionStr = process.env.DB_STRING, //The string thats going to be used to connect to MongoAtlas
  dbName = "ToDoList";//Name of the database project

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})//Takes in the connection string/Mongo needs the second line for stuff
    .then(client => { //The connection to the database
        console.log(`Connection to ${dbName} is looking good`)//Lets you know if the connection worked
        db = client.db(dbName)//Makes it so then, whenever you see "db" you know this line of code is going to connect to the database
    })

app.listen(PORT, ()=>{ //Whenever the server is up and running, it will run this string message
    console.log('Server is up')
})

app.set('view engine', 'ejs')//Looks at the ejs file so we can interact with the frontend
app.use(express.static('public')) //Anything in the public folder, the server will view
app.use(express.urlencoded({extended: true}))//Allows you to view the requests being sent, and pull from them
app.use(express.json())//Allows you to view the requests being sent, and pull from them

app.get('/', async (request, response) => {//Allows you to interact with the ejs file and request stuff from that file
    const listItems = await db.collection('list').find().toArray()//Finds all the documents in the mongo collection and takes them and turns them into an array
    const toDoLeft = await db.collection('list').countDocuments({done: false})
    response.render('index.ejs', {dataItem: listItems, leftToDo: toDoLeft})
})

app.post('/addTask',  (request, response) =>{//When you click the submit button, it will add the list item to the frontend
    console.log(request.body.toDoListItem)//Logging whatever the user typed into the frontend to appear in the terminal
    db.collection('list').insertOne({toDoList: request.body.toDoListItem, completed: false})//Pushes the entered item to Mongo
    .then(result =>{
        console.log('Todo has been added!')//Message, saying that the item entered into the front-end has been logged
        response.redirect('/')//Refresh the page with the new information the user entered
    })
})

app.delete('/deleteListItem', (request, response) => {//Code needed to reflect whats happening in the main.js folder
   db.collection('list').deleteOne({toDoList:request.body.item}) //Adding delete functionality to the frontend and having it also reflect on the server
    .then(result => {
        console.log('A ToDoListItem has been removed')//Let's you know that the item was removed in the console of the site
        response.json('Removed')
    })
    .catch(err => console.log(err))
})

app.put('/markAsDone', (request, response) => {
    db.collection('list').updateOne({toDoList: request.body.item},{//When you click on the todolist item on the frontend, it will forward that to mongo to be updated and changed to done/complete
        $set: { //Object in Mongo stuff
            done: true
        }
    })
    .then(result => {
        console.log('Marked as Done')
        response.json('Done')
    })
})

app.put('/undoCompleted', (request, response) => {
    db.collection('list').updateOne({toDoList: request.body.item},{//When you click on the todolist item on the frontend, it will forward that to mongo to be updated and changed back from being complete
        $set: { //Object in Mongo stuff
            done: false
        }
    })
    .then(result => {
        console.log('Unchecked')
        response.json('Done')
    })
})