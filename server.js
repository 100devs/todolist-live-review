const express = require('express')//requires express
const app = express()//makes it easier to access express throughout document
const MongoClient = require('mongodb').MongoClient//requires mongodb
const PORT = 2121//sets port for server to listen for on localhost
require('dotenv').config()//requires our env, which contains our DB_STRING

let db,//sets variable db
    dbConnectionStr = process.env.DB_STRING, //sets variable for our connection to mongo
    dbName = 'todo'//sets our database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connects us to mongodb, calls our connection string, and implements unified typology (which makes it so that mongo can translate our js, I think)
    .then(client => { //after promise is fulfilled, then call client
        console.log(`Connected to ${dbName} datababe`)//console log our database name, set earlier as 'todo'
        db = client.db(dbName)//set db equal to client.db, calling our variable dbName
    })
    .catch(err =>{//catch an error
        console.log(err)//console log a caught error
    })

app.set('view engine', 'ejs')//allows us to set the view engine for the project to ejs
app.use(express.static('public'))//allows us to access the public folder that contains statis js and css files, with express
app.use(express.urlencoded({ extended: true }))//this has something to do with parsing certain request bodies
app.use(express.json())//this allows us to parse json with express

app.get('/', async (req, res)=>{//this is our get function call, referring back to '/', and creates an asynchronous js function
    const todoItems = await db.collection('todos').find().toArray()//still having a hard time with async, this creates a variable and allows us to set our collection to an array once created
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//this allows us to set our created arrays to completed: false, which will later give us the option of setting them to true as the tasks on our list are crossed off
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//renders our index.ejs file, setting zebra as the docement which contains the array which contains our todos, and left as the object that contains the number of todos left on our list
    })
    


app.post('/createTodo', (req, res)=>{//our post function call, which binds our posts to '/createTodo' and creates the promise
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})//this allows us to use the built-in instertOne function to insert objects as documents into our database as todos, requiring that the object is inserted into the body as todoItem, and setting if to completed:false
    .then(result =>{//next step in promise
        console.log('Todo has been added.')//logs in our console that a todo has been added
        res.redirect('/')//refreshes the page
    })
})

app.put('/markComplete', (req, res)=>{//allows us to update our objects as complete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {//uses built in updateOne to update objects that live in the body and which contain the property rainbowUnicorn
        $set: {//allows us to set the property
            completed: true//property set to true
        }
    })
    .then(result =>{//then
        console.log('Marked Complete')//console logs marked complete
        res.json('Marked Complete')//responds to json with marked complete
    })
})

app.put('/undo', (req, res)=>{//alows us to update our objects once again, this time reverting them to incomplete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {//updates objects within our collection that live in the body and have rainbowUnicorn property
        $set: {//sets the status
            completed: false//reverts the status back to false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res) => {//allows us to call on the '/deleteTodo' that we have set up in main.js within our promise
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})//uses built in deleteOne property to delete an object within our document
    .then(result => {//then
        console.log('Deleted Todo')//logs that we deleted the todo
        res.json('Deleted it, ok? Ok.')//logs to json that we deleted the todo
    })
    .catch(err=>console.log(err))
})

app.listen(process.env.PORT || PORT, ()=>{//tells our server to listen to either our env or our local server
    console.log(`Server set to ${PORT}`)//logs that everything is running
})
