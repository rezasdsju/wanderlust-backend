import express, { request } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose';
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

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ msg: 'Unauthorizad' })
    }
    const token = authHeader.split(' ')[1]
    // console.log(token)
    if (!token) {
        return res.status(401).send({ msg: 'Unauthorizad' })
    }

    const JWKS = createRemoteJWKSet(
        new URL(`${process.env.FRONTEND_HOMEPAGE_URL}/api/auth/jwks`)
    )
    try {
        const { payload } = await jwtVerify(token, JWKS)
        req.authUserId = payload.sub

        next()
    } catch {
        console.error(error.message)
        return res.status(401).send({ message: 'Invalid or expired token' })
    }
}

const usersCollection = db.collection('user')

const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.authUserId;

        const userQuery = [
            { id: userId },
            { _id: userId }
        ];

        if (ObjectId.isValid(userId)) {
            userQuery.push({ _id: new ObjectId(userId) });
        }

        const user = await usersCollection.findOne({
            $or: userQuery
        });

        if (!user || user.role !== 'admin') {
            return res.status(403).send({
                message: 'Forbidden: Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'Failed to verify admin role'
        });
    }
};


app.get('/', (req, res) => {
    res.json({
        message: 'Wanderlust API is running successfully.',
        endpoints: {
            destinations: {
                method: 'GET',
                path: '/destinations',
                protected: false
            },
            featuredDestinations: {
                method: 'GET',
                path: '/featured-destinations',
                protected: false
            },
            destinationDetails: {
                method: 'GET',
                path: '/destinations/:id',
                protected: true
            },
            createDestination: {
                method: 'POST',
                path: '/destinations',
                protected: true
            },
            updateDestination: {
                method: 'PATCH',
                path: '/destinations/:id',
                protected: true
            },
            deleteDestination: {
                method: 'DELETE',
                path: '/destinations/:id',
                protected: true
            },
            createBooking: {
                method: 'POST',
                path: '/booking',
                protected: true
            },
            myBookings: {
                method: 'GET',
                path: '/my-bookings/:email',
                protected: true
            },
            cancelBooking: {
                method: 'DELETE',
                path: '/my-bookings/:id',
                protected: true
            }
        }
    })
})

app.get('/destinations', async (req, res) => {
    try {
        const destinations = await destinationCollections.find({}).toArray()
        res.send(destinations)
    } catch (error) {
        console.error(error)
        res.status(500).send({ 'message': 'Failed to fetch destinations' })
    }
})
app.get('/featured-destinations',async(req,res)=>{
    try {
        const featuredDestinations = await destinationCollections.find().limit(5).toArray()
        res.send(featuredDestinations)
    } catch(error) {
        console.log(error)
        res.status(500).send({'message':'Failed to fetch featured destinations'})
    }
})
app.get('/destinations/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const query = { _id: new ObjectId(id) }
    const result = await destinationCollections.findOne(query)
    res.send(result)
})

app.post('/destinations',verifyToken,verifyAdmin, async (req, res) => {
    // console.log(req.body)
    const newDestination = req.body
    const result = await destinationCollections.insertOne(newDestination)
    res.send(result)
})
app.patch('/destinations/:id',verifyToken,verifyAdmin, async (req, res) => {
    const { id } = req.params
    const filter = { _id: new ObjectId(id) }
    // const options = { upsert: true }
    const updatedDestination = req.body
    const updateDoc = {
        $set: updatedDestination
    }
    const result = await destinationCollections.updateOne(filter, updateDoc);
    res.send(result)
})
app.delete('/destinations/:id',verifyToken,verifyAdmin, async (req, res) => {
    const { id } = req.params
    const query = { _id: new ObjectId(id) }
    const result = await destinationCollections.deleteOne(query)
    res.send(result)
})


app.post('/booking',verifyToken, async (req, res) => {
    const data = req.body
    const result = await bookingCollections.insertOne(data)
    res.send(result)
})
app.get('/my-bookings/:email',verifyToken, async (req, res) => {
    const { email: emailFromClient } = req.params
    const result = await bookingCollections.find({ email: emailFromClient }).toArray()
    res.send(result)
})
app.delete('/my-bookings/:id',verifyToken, async (req, res) => {
    const { id } = req.params
    const result = await bookingCollections.deleteOne({ _id: id })
    res.send(result)
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})



export default app