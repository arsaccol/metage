import {Server} from 'socket.io'

const io = new Server()

io.on('connection', socket => {
    console.log(`${socket.id} connected!`)
})

io.listen(12345)
