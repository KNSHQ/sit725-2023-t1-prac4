let express = require('express');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";
let port = process.env.PORT || 3000; // Corrected the environment variable name to uppercase

let collection;

app.use(express.static(__dirname + '/public')) // Serve static files from the 'public' directory
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.urlencoded({extended: false})); // Middleware for parsing URL-encoded bodies

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to establish MongoDB connection
async function runDBConnection() {
    try {
        await client.connect();
        const dbName = 'Cats'; // Specify your database name here
        collection = client.db(dbName).collection('Cat');
        console.log('Database connection established and collection selected');
    } catch(ex) {
        console.error('Failed to connect to the database:', ex);
    }
}

// Route for serving the index page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/indexMongo.html'); // Serve indexMongo.html from the public directory
});

// Async route handler for getting all cats
app.get('/api/cats', async (req, res) => {
    try {
        const result = await getAllCats();
        res.json({statusCode: 200, data: result, message: 'Get all cats successful'});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err }); // Error handling
    }
});

// Async route handler for posting a new cat
app.post('/api/cat', async (req, res) => {
    try {
        const cat = req.body;
        const result = await postCat(cat);
        res.status(201).json({statusCode: 201, data: result, message: 'Success'}); // Send 201 status on success
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err }); // Error handling
    }
});

// Async function to insert a new cat into the database
async function postCat(cat) {
    return await collection.insertOne(cat);
}

// Async function to get all cats from the database
async function getAllCats() {
    return await collection.find({}).toArray();
}

// Start the server and establish a database connection
app.listen(port, () => {
    console.log(`Express server started on port ${port}`);
    runDBConnection();
});
