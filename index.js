const express =require('express')
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT |3000;
const app=express()
//midleware
app.use(cors())
app.use(express.json())

//mongodb connection
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rin8xcl.mongodb.net/?retryWrites=true&w=majority`;

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
   // await client.connect();


    const menuCollection = client.db("bistrodb").collection("menu");
    const reviewsCollection=client.db('bistrodb').collection('reviews')
    const cardCollection=client.db('bistrodb').collection('cards')
    const usersCollection = client.db("bistrodb").collection("users");

    // User-related APIs
    app.get('/users',async(req,res)=>{
      const result=await usersCollection.find().toArray();
      res.send(result)
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query={email: user.email}
      const existingUser= await usersCollection.findOne(query);
      console.log('existing User', existingUser)
      if(existingUser){
        return res.send({message: 'user already exists'})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.patch('/users/admin/:id',async(req,res)=>{
      const id=req.params.id;
      const filter ={_id : new ObjectId(id)};
      const updateDoc ={
        $set:{
          role : "admin"
        },
      };
      const result =await usersCollection.updateOne(filter,updateDoc);
      res.send(result)
    })
    //get for menu
    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray();
        res.send(result)
    })
//get for reviews
   app.get('/review',async(req,res)=>{
    const result=await reviewsCollection.find().toArray();
    res.send(result)
   })

   //post when click order then its add on the cardCollection
 app.post ('/cards',async(req,res)=>{
  const item=req.body;
  const result=await cardCollection.insertOne(item);
  res.send(result);
 })
//get posted data email ways so its like to some get...
app.get('/cards',async(req,res)=>{
  const email=req.query.email;
  console.log(email);
  if(!email){
    res.send([])
  }
  const query={email:email}
  const result=await cardCollection.find(query).toArray();
  res.send(result)
 })  

 //delete
 app.delete('/cards/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId (id) }
   const result=await cardCollection.deleteOne(query);
   res.send(result);
 }
 
 )
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
    res.send('boss is running')
})
app.listen(port,(req,res)=>{
    console.log(`bistro boss  is running on Port: ${port}`)
})