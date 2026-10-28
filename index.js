import express, { request } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

const client = new MongoClient(process.env.MONGODB_URI)

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const mongoConnection = await connectToMongoDB()
const db = mongoConnection.db('wanderlust_main')
const destinationCollections = db.collection('destinations')
const bookingCollections = db.collection('bookings')

app.get('/destinations', async (req, res) => {
    try {
        const destinations = await destinationCollections.find({}).toArray()
        res.send(destinations)
    } catch (error) {
        console.error(error)
        res.status(500).send({ 'message': 'Failed to fetch destinations' })
    }
})
app.get('/destinations/:id', async (req, res) => {
    const { id } = req.params
    const query = { _id: new ObjectId(id) }
    const result = await destinationCollections.findOne(query)
    res.send(result)
})

app.post('/destinations', async (req, res) => {
    // console.log(req.body)
    const newDestination = req.body
    const result = await destinationCollections.insertOne(newDestination)
    res.send(result)
})
app.patch('/destinations/:id', async (req, res) => {
    const { id } = req.params
    const filter = { _id: new ObjectId(id) }
    // const options = { upsert: true }
    const updatedDestination = req.body
    const updateDoc = {
        $set:updatedDestination
    }
    const result = await destinationCollections.updateOne(filter, updateDoc);
    res.send(result)
})
app.delete('/destinations/:id', async(req,res)=>{
    const {id} = req.params
    const query = {_id: new ObjectId(id)}
    const result = await destinationCollections.deleteOne(query)
    res.send(result)
})


app.post('/booking',async(req,res)=>{
    const data = req.body
    const result = await bookingCollections.insertOne(data)
    res.send(result)
})
app.get('/my-bookings/:email', async(req,res)=>{
    const {email:emailFromClient} = req.params
    const result = await bookingCollections.find({email:emailFromClient}).toArray()
    res.send(result)
})
app.delete('/my-bookings/:id', async(req,res)=>{
    const {id} = req.params
    const result = await bookingCollections.deleteOne({_id:id})
    res.send(result)
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})



export default app