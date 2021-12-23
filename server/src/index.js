import dotenv from 'dotenv'
import {Server} from 'socket.io'

import Game from './game.js'

dotenv.config()

console.log(`Starting socket.io server on port ${process.env.SOCKET_PORT}!`)

const io = new Server({
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        //origin: '*',
        methods: ['GET', 'POST'],
    }
})


io.on('connection', socket => {
    console.log(`${socket.id} connected!`)

    io.on('disconnect', () => {
        console.log(`User ${socketid} disconnected!`)
    })
})

io.listen(process.env.SOCKET_PORT)

const game = new Game(io)
