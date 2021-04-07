const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//trouble HAPPENS here, Leon. I feel like you go too fast on the node part, and as I tried to follow along on monday, I failed. I had to pause the stream, delete the clusters, start over and get it working.
//the main problem I feel happens in the workflow between MongoDB and the server. This connection is "weird".
let db,
    // That Database string must be explained in its 3 variables: login, password AND database name.   
    dbConnectionStr = process.env.DB_STRING,
    //what is this? Did you make this todo here on the server? Or is it made on mongoDB? If its made on Mongo how do they connect? 
    dbName = 'todo'
//not sure what is unifiedTopology, but if you say its to avoid errors, I set and forget it.
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        //why are we using interpolation here? Will the dbName from line 13, change? If not, why not be literal about it?
        console.log(`Hey, connected to ${dbName} database`)
        //assigning client.db(dbName) to the value of db. client came from the then above, and .db is a method on it. I'm ok with that knowledge at the moment.
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
//not sure what this does. I will comment out on my code, and see the errors. But I understand that its setting the environment to work in a certain way.
app.use(express.urlencoded({ extended: true }))
//is this setting every response into json? Dont get to han
app.use(express.json())

//http get, will connect to collection "todos", find all, make it into and Array; and count all that are completed: false. Store in variables, pass to the ejs.
app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//http post, will insert the data from the ejs <form>
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    
