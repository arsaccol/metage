import {Server} from 'socket.io'

const SOCKET_PORT = 12345
const CLIENT_ORIGIN = 'http://localhost:3000'


console.log(`Starting socket.io server on port ${SOCKET_PORT}!`)

const io = new Server({
    cors: {
        origin: CLIENT_ORIGIN,
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

io.listen(SOCKET_PORT)
