const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=4000;
//middleware
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5g2qurp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const booksCollection=client.db('book-spot').collection('books');

        app.get('/book', async(req, res)=>{
            const query={};
            const cursor= booksCollection.find(query);
            const books= await cursor.toArray();
            res.send(books)
        })
        app.get('/book/:id', async(req, res)=>{
            const id =req.params.id;
            const query={_id:ObjectId(id)}
            const filter= await booksCollection.findOne(query);
            res.send(filter)
        })
    }
    finally{

    }
}
run()


app.get('/', (req, res)=>{
    res.send('Welcome to book spot');
})
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
