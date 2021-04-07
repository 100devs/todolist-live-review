
///line below is setting up our express. It is installed by adding npm install express --save on terminal
const express = require('express')
// line below is to be able to call express for the rest of this file by just using app
const app = express()
/// This line below is setting up mongo to be used. You npm install mongodb --save in terminal prior
const MongoClient = require('mongodb').MongoClient
/// This creates a variable for our port. We use PORT in our app.listen to run the server
const PORT = 2121
//// not entirely sure yet
require('dotenv').config()

//// This creates three variables for us. db is our database from MongoDb? 
////dbConnectionStr is our link for our mongodb database. Process.env.DB_STRING is ????
/// dbName the name of our database? The name we use in place of the name default name.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


///This connects our mongodb. DbConnectionStr is the link. useUnifiedTopology is to avoid the message in terminal?

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//// This creates our promise. Client is our database? dv variable is now defined by making it our client.db(dbName)
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })


//// This below lets our server.js communicate with our ejs file. npm install ejs --save is required
app.set('view engine', 'ejs')
//// This below lets our code from public be readable and compatible?
app.use(express.static('public'))
/// Not sure what this is
app.use(express.urlencoded({ extended: true }))
/// Not sure what this is
app.use(express.json())


////This sets up our get. '/' is the default page for our server? 
app.get('/', async (req,res)=>{
/// todoItems is the variable that will contain all the todoItems inputed by user.
/// 'todos' is the name of our list in mongo? find finds the items but put it into an array
    const todoItems = await db.collection('todos').find().toArray()
/// below is a variable for items that have not been deleted. Completed: false is the default 
/// and it means it hasnt been checked out
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
/// res render is what will render on the page. It renders the index.ejs file, and it brings in the object of to
/// doItems and the count of how many are left
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})


/// app.post is the section that helps create new items on the list. '/createTodo' is grabbed
/// from the form ACTION. 
app.post('/createTodo', (req, res)=>{
/// like above, db.collection is the database, todos is the name of the database,
/// only here, we are inserting one with insertOne. req.body.todoItem is grabbed
/// from input NAME. We add a completed: false because we always want to make it false in the beginning
/// until it is completed which will change to true with our user side javascript.
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
/// because the code above is a promise, we must create a .then with result.
    .then(result =>{
        console.log('Todo has been added!')
/// below redirects the page back to the default page after one is added, otherwise the page will
/// progress will just continue to spin        
        res.redirect('/')
    })
})



/// This section is to update items that are already on the list. This is dependant upon
/// our main.js code. '/markComplete comes from the variable todoItem, which is meant to select
/// all items that have the class .todoItem AND span. It is then an eventListener function
app.put('/markComplete', (req, res)=>{
/// Like above, it continues to look at the database named todos, only here, we are updating and item
/// We look for the item by req.body.rainbowUnicorn, which is defined within the main.js. 
/// The variable todoText is what rainbowUnicorn points to
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
/// Every item that is posted, has the false property set as default. This put action changes it from
/// false to true. 
        $set: {
            completed: true
        }
    })
/// Like everything else, the above is a promise, so we have to create a then. Make it result again,

    .then(result =>{
        console.log('Marked Complete')
/// the response here is res.json (not sure what that means) LOOK THIS UP!!!        
        res.json('Marked Complete')
    })
})



/// This here is another put action that updates something. This one here targets items that have
/// the property true instead of false. It helps change it back to false, which removes the css 
/// style created by the main.js eventListener function. The /undo is found by the fetch() in undo
/// function.
app.put('/undo', (req, res)=>{
/// looks for the items with properties set to true, and it's switched to false. It finds it
/// by the .todoItem span.completed classes.
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
/// Again LOOK THIS UP. Not sure what this does        
        res.json('Marked Complete')
    })
})


/// This section is to delete an item from the list. Points to the function in the main.js
/// that has the fetch(deleteTodo).
app.delete('/deleteTodo', (req, res)=>{
/// This again, finds the database collection named todos. This one uses the built-in function
/// deleteOne. It deletes one by finding it using the api directory req.body.rainbowUnicorn    
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
/// It's a promise, so you have to run the .then. HOW CAN I TELL IF SOMETHING IS A PROMISE???    
    .then(result =>{
        console.log('Deleted Todo')
/// AGAIN LOOK THIS UP
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
/// This is the app.listen that helps your server side get running. The PORT is the one we create.
/// NOW, im still not 100% comfortable using the process.env. I have to look at the video again to 
/// see how this is done. I do know that if that doesnt work, the || is or our PORT 2121
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    
