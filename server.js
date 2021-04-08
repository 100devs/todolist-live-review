const express = require('express')//Loads express module
const app = express()//Creates a faster-to-use variable for the above module
const MongoClient = require('mongodb').MongoClient//Loads mongodb
const PORT = 2121//Establishes listening port for server
require('dotenv').config()//Allows for the .env file to be used for hidden data

let db,//Declaring the variable for the database
    dbConnectionStr = process.env.DB_STRING,//Assigning the string which contsins the login creds from the dotenv
    dbName = 'todo'//Declaring the string that points to our database name

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})//Tells the mongodb modules to use the .connect() method and connect with the database
    .then(client => {//Upon fulfilling the promise
        console.log(`Hey, connected to ${dbName} database`)//Print a succesful connection console log
        db = client.db(dbName)//Assign the property of db of the client object with an argument of our database name to our db variable
    })
    .catch(err =>{//unless an error has occurred
        console.log(err)//then console log the error
    })

app.set('view engine', 'ejs')//Sets express to use ejs to be viewed in the DOM
app.use(express.static('public'))//Points to our public directory that will contain js and css files that the index.ejs will  link to and use
app.use(express.urlencoded({extended: true}))//I DON'T KNOW
app.use(express.json())//Tells express to format data in JSON objects

app.get('/', async (req, res) => {//Get request to load the main
    const todoItems = await db.collection('todos').find().toArray()//I don't really know... perhaps counting how many total todos there are, regardless of completion
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Counts how many todos have the completed property with a false value
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//Prints to the ejs file how many todos are left to complete
})

app.post('/createTodo', (req, res)=>{//A POST method is used, connecting to the createTodo input
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})//Inserts the todoItem with a completed property of false into the database
    .then(result =>{//After successfully inserting, 
        console.log('Todo has been added!')//Print a success message to the console
        res.redirect('/')//Direct the browser back to the base directory
    })
})

app.put('/markComplete', (req, res)=>{//A PUT method that changes individual todos from 'completed: false' to 'completed: true',
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//Updates the condition of one todo
        $set: {//I dont know...
            completed: true//sets the property of 'completed' to true
        }
    })
    .then(result =>{//upon success
        console.log('Marked Complete')//print a success msg in the console
        res.json('Marked Complete')//I don't know what this does in regards to the JSON
    })
})

app.put('/undo', (req, res)=>{//A PUT method that changes the todos' 'completed: true' to 'completed: false'
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//Updates the condition of one todo
        $set: {//I dont know...
            completed: false//sets the property of 'completed' to false
        }
    })
    .then(result =>{//upon success
        console.log('Marked Complete')//print a success msg in the console
        res.json('Marked Complete')//I don't know what this does in regards to the JSON
    })
})

app.delete('/deleteTodo', (req, res)=>{//A DELETE method that will remove a todo from the database
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})//selects and removes one todo object from the database
    .then(result =>{//after successfully accomplishing the delete
        console.log('Deleted Todo')//print a success msg to the console
        res.json('Deleted It')//I don't know what this does in regards to the JSON
    })
    .catch( err => console.log(err))//Console log an error with its details if applicable
})
 
app.listen(process.env.PORT || PORT, ()=>{//Sets the server's port to be connected to by a client.  With either the prefered (heroku, etc) port of the hard coded PORT variable value from above
    console.log('Server is running, you better catch it!')//A silly message to let you know that the server is operational
})    
