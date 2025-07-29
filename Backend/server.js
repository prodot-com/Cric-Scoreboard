import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()

// Allow multiple origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
}))

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id)

    socket.on('message', (data) => {
        console.log('Message received: ', data),
        io.emit('message', data)
    })

    socket.on('newMessage', (data)=>[
        console.log('New Message Recieved: ', data),
        io.emit(data)
    ])
})

app.get('/', (req, res) => {
    res.send("Socket.io backend running")
})

httpServer.listen(9000, () => {
    console.log('server running on localhost:9000')
})
