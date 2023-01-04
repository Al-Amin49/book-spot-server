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
        const orderCollection=client.db('book-spot').collection('order');

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

        //add a book

        app.post('/book', async(req, res)=>{
            const book= req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result);
        })

        //delete a book
        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        })

        //order collection

        app.get('/order', async(req, res)=>{
            const email=req.query.email;
            const  query={email:email};
            const cursor =orderCollection.find(query);
            const orders= await cursor.toArray();
            res.send(orders);
        })

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
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
