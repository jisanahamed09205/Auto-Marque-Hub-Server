const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s0a6uh7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const brandCollection = client.db('productDB').collection('brand');

    app.get('/brands',async(req,res)=>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:name', async(req,res)=>{
      const namesOfBrand = req.params.name
      const query = {brandName : {$eq : namesOfBrand}}
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/productDetails/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    app.get('/productsKaku/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    app.put('/productsKakus/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateCar = req.body;
      const updated = {
        $set: {
          name: updateCar.name,
          brandName: updateCar.brandName,
          price: updateCar.price,
          rating: updateCar.rating,
          type: updateCar.type,
          shortDescrib: updateCar.shortDescrib,
          image: updateCar.image
        }
      }
      const result =await productCollection.updateOne(filter,updated,options)
      res.send(result)
    })

    app.get('/products',async(req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/products',async(req,res)=>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("AutoMarque-Hub server is running")
})

app.listen(port, () =>{
    console.log(`AutoMarque-Hub is Running On Port: ${port}`)
})