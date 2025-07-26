import express from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors:{
        origin: "https://localhost:5173",
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket)=>{
    console.log('User Connected: ', socket.id)
})


app.get('/', (req, res)=>{
    res.send("Socket.io backend running")
})

httpServer.listen(9000, ()=>{
    console.log('server running on localhost:9000')
})