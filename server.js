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

app.get('/', (request, response) => {//Allows you to interact with the ejs file and request stuff from that file
    response.render('index.ejs')//Display the ejs file
})

app.post('/addTask',  (request, response) =>{//When you click the submit button, it will add the list item to the frontend 
    db.collection('toDoList').insertOne({})//Pushes the entered item to Mongo
})