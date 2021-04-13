const express= require('express') //to use express dependancy
const app = express () // rename express for shorthand
const MongoClient=require('mongodb').MongoClient //connect us to mongo.db
const PORT =2222 // port to use if environment doesnt have one
require('dotenv').config() //to use the environment variable


let db, // created to access database
    dbConnectionStr = process.env.DB_STRING, //where you place the link from database to connect your server to objs in database
    dbName ='todo' //naming your database collection
// promise to connect to database; unified topology is to not get error while making your app
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => { //what to do when connection to database is resolved
        console.log(`Hey, connected to ${dbName} database`) //to show we connected to database
        db= client.db(dbName) // grab the connection and store it in this db variable we created up top
    })
    .catch(err=>{ //show error if one occurs during request
        console.log(err)
    })

    //use this pattern to avoid trouble with code. ALL the above is middleware
app.set('view engine', 'ejs') //set up to use ejs files.
app.use(express.static('public')) //server can serve up any static file put in folder
app.use(express.urlencoded({extended:true })) //allow access to pull info from form
app.use(express.json()) //same as above

// whenever server hear get request, it will show callback inside, using await syntax
app.get('/', async (req, res)=>{ 
    const todoItems = await db.collection('todos').find().toArray() //finds the items and make them array // find the to do items to hold all the documents we have n turn them into array then return it to ejs
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //grabs item with completed false element //find the items that are false and count them to return number left to ejs "items left"
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//pass both of the above to ejs(count & todos) //respone to send database items  to ejs spits out html. 
    
    })

//user is submitting something using the form on ejs
app.post('/createTodo', (req, res)=>{                       //completed false so each item starts as not completed
db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false}) //insertOne is method that return obj(to do item & whether or not it is a completed item) //send it to mongo(ie push to database)
    .then(result=> {  //promise
        console.log('Todo has been added!')
        res.redirect('/')
    })
})


app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  //finds the match you're trying to update and grabs the text
        $set: {
            completed: true  //once match is found, set completed property to true
        }
    })
    .then(result=>{  //promise response on what to do when resolved
        console.log('Marked completed')
        res.json('Marked complete')
    })
})

//undo the once completed item
app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {  //if its already completed and we click on it a second time it will undo and mark to false
            completed: false
        }
    })
    .then(result=>{ //when promise is resolved, responde with this
        console.log('Marked completed')
        res.json('Marked complete')
    })
})


app.delete('/deleteTodo', (req, res)=>{ //fires after hearing fetch on main.js
db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result=> {
        console.log('Deleted todo')
        res.json('Deleted it') //send to fetch that you deleted it
    })
})



app.listen(process.env.PORT || PORT, ()=>{ //use heroku environment or ours
    console.log(`Server running on port ${PORT}`)
})



