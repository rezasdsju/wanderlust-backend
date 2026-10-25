import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';
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


app.get('/destinations', async (req, res) => {
    try {
        const destinations = await destinationCollections.find({}).toArray()
        res.send(destinations)
    } catch (error) {
        console.error(error)
        res.status(500).send({ 'message': 'Failed to fetch destinations' })
    }
})

app.post('/destinations', async (req, res) => {
    // console.log(req.body)
    const newDestination = req.body
    const result = await destinationCollections.insertOne(newDestination)
    res.send(result)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})