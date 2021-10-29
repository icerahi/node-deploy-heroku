const express = require("express");
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcwm7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const run = async()=>{
  try{
    await client.connect();
    // console.log('connected to database')
    const database = client.db('carMachanic');
    const servicesCollection = database.collection('services')

    //GET ALL API
    app.get('/services',async(req,res)=>{
      const cursor = servicesCollection.find({})
      const services = await cursor.toArray()
      res.send(services)
    })
    //GET Single Service
    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const service = await servicesCollection.findOne(query)
      res.send(service)
    })
    //POST API
    app.post('/services',async(req,res)=>{
     const service =req.body
    const result = await servicesCollection.insertOne(service)
    console.log(result)
    res.json(result)
    })
    //DELETE API
    app.delete('/services/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await servicesCollection.deleteOne(query)
      res.json(result)
    })
  }
  finally{
    // await client.close()
  }

}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Running Genius Car Machanic Server");
});
app.get('/hello',(req,res)=>{
  res.send('Hello updated here')
})
app.listen(port, () => {
  console.log("Running Genius Car Machanic Server on PORT:", port);
});
