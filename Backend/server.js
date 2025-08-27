import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import connectDB from './db/index.js'
import matchRouter from './Routes/Match.route.js'

const app = express()

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: allowedOrigins,
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

    socket.on('joinMatch', (matchId)=>{
        socket.join(matchId)
        console.log(`Socket ${socket.id} joined match room: ${matchId}`)
    })

    socket.on("scoreUpdate", ({ matchId, data }) => {
    console.log("Score update for match:", matchId, data);
    io.to(matchId).emit("scoreUpdate", { matchId, ...data });
  });

    socket.on('disconnect', (reason)=>{
        console.log('User Disconnected: ',socket.id,'-->',reason)
    })
})

app.get('/', (req, res) => {
    res.send("Socket.io backend running")
})

httpServer.listen(9000, () => {
    console.log('server running on localhost:9000')
})
