const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_EQUIPMENTS}:${process.env.DB_PASS}@cluster0.5rne0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const sportsCollection = client.db('sportsDB').collection('sports');

    app.get('/equipments', async (req, res) => {
      const cursor = sportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/equipments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result);
    });

    app.post('/equipments', async (req, res) => {
      const newEquipments = req.body;
      console.log(newEquipments);
      const result = await sportsCollection.insertOne(newEquipments);
      res.send(result);
    });

    app.put('/equipments/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }; // ফিল্টার: যে ডকুমেন্ট আপডেট করবেন
      const options = { upsert: true }; // যদি ডকুমেন্ট না থাকে, তাহলে তৈরি করবে
      const updatedEquipment = req.body; // ক্লায়েন্ট থেকে পাঠানো ডেটা

      const updateDoc = {
        $set: {
          image: updatedEquipment.image,
          itemName: updatedEquipment.itemName,
          categoryName: updatedEquipment.categoryName,
          description: updatedEquipment.description,
          price: updatedEquipment.price,
          rating: updatedEquipment.rating,
          customization: updatedEquipment.customization,
          processingTime: updatedEquipment.processingTime,
          stockStatus: updatedEquipment.stockStatus,
        },
      };

      try {
        const result = await sportsCollection.updateOne(
          filter,
          updateDoc,
          options
        ); // সঠিক ফরম্যাট
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to update equipment');
      }
    });

    app.delete('/equipments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('export-equipments-server is running');
});
app.listen(port, () => {
  console.log(`sports-equipments-server is running on port : ${port}`);
});
