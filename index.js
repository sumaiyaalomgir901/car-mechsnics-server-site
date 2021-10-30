const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

//=========
const app = express();
const port = 1003;
//////// USE MIDDLEWARE
app.use(cors());
app.use(express.json());

/////////////
////////////
app.get("/", (req, res) => {
  res.send("Car Mechanics Center");
});
///////////////

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trzwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log("mongodb uri : ", uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("car_service");
    const serviceCollection = database.collection("service");

    //GET API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log("specific service", id);
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });
    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
///////////////

app.listen(port, () => {
  console.log("Port :", port);
});
