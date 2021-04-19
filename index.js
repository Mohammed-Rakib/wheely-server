const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
app.use(express.json());
app.use(cors());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z4xqh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const wheelyServices = client.db("wheely").collection("services");
  const wheelyReview = client.db("wheely").collection("wheelyReview");

  app.post('/addService', (req, res) => {
      const newService = req.body;
      console.log(newService);
      wheelyServices.insertOne(newService)
      .then( result => {
          console.log('inserted count',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    wheelyReview.insertOne(newReview)
    .then( result => {
        console.log('inserted count',result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})

app.get('/review', (req, res) => {
  wheelyReview.find()
  .toArray( (err, documents) => {
      res.send(documents)
  })
})

  app.get('/services', (req, res) => {
      wheelyServices.find()
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})