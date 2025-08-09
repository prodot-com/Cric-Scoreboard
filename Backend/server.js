import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import connectDB from './db/index.js'
import matchRouter from './Routes/Match.route.js'

const app = express()

app.use(express.json())

// Allow multiple origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"]

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
}))

const httpServer = createServer(app)

connectDB()

app.use('/user', matchRouter)

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id)

    // Join a match room
    socket.on('joinMatch', (matchId) => {
        socket.join(matchId)
        console.log(`Socket ${socket.id} joined match room: ${matchId}`)
    })

    // Generic message
    socket.on('message', ({ data, matchId }) => {
        console.log('Message received: ', data, 'MatchId: ', matchId)
        io.to(matchId).emit('message', data) // ✅ only send to that match
    })

    // Chat or new message
    socket.on('newMessage', ({ data, matchId }) => {
        console.log('New Message Received: ', data, 'MatchId: ', matchId)
        io.to(matchId).emit('newMessage', data) // ✅ only send to that match
    })

    // Team details update
    socket.on('teamDetails', ({ data, matchId }) => {
        console.log('Team details received for match:', matchId, data)
        io.to(matchId).emit('teamDetails', data) // ✅ only send to that match
    })

    socket.on('disconnect', (reason) => {
        console.log('User Disconnected: ', socket.id, '-->', reason)
    })
})

app.get('/', (req, res) => {
    res.send("Socket.io backend running")
})

httpServer.listen(9000, () => {
    console.log('server running on localhost:9000')
})
