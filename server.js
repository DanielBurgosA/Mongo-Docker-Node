const express = require('express');
const bodyParser = require('body-parser')

// App
const app = express();

//mongoClient
const {promisify} = require('util');
const { log } = require('console');
const MongoClient = require ('mongodb').MongoClient;

// const url = 'mongodb://mongodb-container:27017'
const url = 'mongodb://localhost:27017/';
const db_name = 'mock_databe';
const collectionName = 'users';

//port app
const hostname = '0.0.0.0';
const port = 8080;
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
  
// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

// GET method route
app.get('/secret', function (req, res, next) {
    res.send('Never be cruel, never be cowardly. And never eat pears!');
    console.log('This is a console.log message.');
});

/*
Your implementation here 
*/


// GET method route
app.get('/api/get/', async (req,res)=>{
    const gender = req.query.gender;
    try {
        const client = await MongoClient.connect(url)
        const dbo = client.db(db_name)
        const collection = dbo.collection(collectionName)
        const query = gender ?  {"gender": gender } : {};
        const result = await collection.find(query).toArray();

        result.length>0 ? res.status(200).send(result) : res.status(200).send("The collection is empty");
        client.close(); 
        
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error: ${error.message}`)
    }
})


/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
app.put('/api/put/', async (req, res) => {
    const newData = req.body;
    const email = newData.email;

    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db(db_name);
        const collection = dbo.collection(collectionName);
        const existingDocument = await collection.findOne({ email: email });

        if (existingDocument) {
            const updatedDocument = { $set: newData };
            await collection.updateOne({ email: email }, updatedDocument);
            res.status(200).send("Documento actualizado con éxito."); // 200 OK
        } else {
            // Si el documento no existe, crea uno nuevo con los datos proporcionados
            await collection.insertOne(newData);
            res.status(201).send("Nuevo documento creado."); // 201 Created
        }

        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
// ...

app.listen(port, hostname);
console.log(`Running on http://localhost:${port}`);

