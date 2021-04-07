const express = require('express') //calling express
const app = express() //allows us to use express
const MongoClient = require('mongodb').MongoClient //to be able to use mongodb
const PORT = 2121 //port we pick
require('dotenv').config() //allows us to use dotenv

let db, //seeting variable db
    dbConnectionStr = process.env.DB_STRING, //variable for process.env.DB_STRING
    dbName = 'todo' //the name that will be put in the DB_STRING under .env file

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // I dont know what this does
    .then(client => { // I dont know what this does
        console.log(`Hey, connected to ${dbName} database`) //console.log to show us the db is connected
        db = client.db(dbName) //setting db variable to equal
    })
    .catch(err =>{ //catch error
        console.log(err) //console.log catch error
    })

app.set('view engine', 'ejs') //lets us use ejs
app.use(express.static('public')) //setting public as folder to use css and js folders
app.use(express.urlencoded({ extended: true })) // I dont know what this does
app.use(express.json()) // I dont know what this does, maybe lets us use json with express

app.get('/', async (req,res)=>{ //async get (CRUD) request and response params
    const todoItems = await db.collection('todos').find().toArray() //var todoItems set to db and find array (await)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // I dont know what this does
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // I dont know what this does, I know it renders the ejs thats what it gets from app.get but i dont get the secodn param
})

app.post('/createTodo', (req, res)=>{ //async post (CRUD) link to post from ejs with the same action name
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //from db toods we insert what is from the DOM and is not completed so no line thorugh it
    .then(result =>{ //I dont know what this does
        console.log('Todo has been added!') //console.log shows we added something to make sure everything is working fine
        res.redirect('/') //redirects to app.get so basically reloads the page to show new item
    })
})

app.put('/markComplete', (req, res)=>{ //put request from (CRUD) link to main.js function markcomplete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //db todos updates with whatever is written in DOM from main.js rainbowunicorn var
        $set: { //I dont know what this does
            completed: true //setting compeleted as true so line can be crossed through it when clicked
        }
    })
    .then(result =>{ //I dont know what this does
        console.log('Marked Complete') //console.log action to show it was complete
        res.json('Marked Complete') //I dont know what this does
    })
})

app.put('/undo', (req, res)=>{ //put request from (CRUD) link to main.js function undo
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //db todos updates with whatever is written in DOM from main.js
        $set: { //I dont know what this does
            completed: false //seeting completed to false makes it so a line doesnt go through the todo
        }
    })
    .then(result =>{ //I dont know what this does
        console.log('Marked Complete') //console.log action to show it was complete
        res.json('Marked Complete') //I dont know what this does
    })
})

app.delete('/deleteTodo', (req, res)=>{ //delete (CRUD) links to main.js function deleteTodo
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //db todos updates by deleting whatever is in the DOM from main.js
    .then(result =>{ //I dont know what this does
        console.log('Deleted Todo') //console.log action to s how it wwas deleted
        res.json('Deleted It') //I dont know what this does
    })
    .catch( err => console.log(err)) //cacth error in case something goes wrong
})

app.listen(process.env.PORT || PORT, ()=>{ //listens for the port by mongo or our own port
    console.log('Server is running, you better catch it!') //consoles shows the server is running and working
})
