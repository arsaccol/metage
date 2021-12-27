import * as THREE from 'three'
import { Server } from 'socket.io'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

class Game
{
    constructor()
    {
        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        this.initScene()
        this.players = {}


        console.log(`Starting Socket.IO game server on port ${process.env.SOCKET_PORT}!`)
        this.io = new Server({
            cors: {
                origin: process.env.CLIENT_ORIGIN,
                methods: ['GET', 'POST']
            }
        })

        this.initNetworkEvents()
        this.io.listen(process.env.SOCKET_PORT)
    }

    initNetworkEvents()
    {
        this.io.on('connection', this.onConnection)
    }

    onConnection = (socket) => 
    {
        console.log(`${socket.id} connected to server at ${new Date().toISOString()}!`)

        socket.on('client:spawn-request', () => {

            console.log(`Spawning new player with ID: ${socket.id}!`)

            const newPlayerObject3D = new THREE.Object3D()
            newPlayerObject3D.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
            newPlayerObject3D.lookAt(new THREE.Vector3())
            newPlayerObject3D.rotateY(Math.PI)

            this.players[socket.id] = newPlayerObject3D
            const {position, quaternion} = {...newPlayerObject3D}

            socket.emit('server:spawn-response', {position: position, quaternion: quaternion})

            console.log(`Players connected: [${Object.keys(this.players)}]`)
            socket.broadcast.emit('other-clients:spawn-broadcast', {id: socket.id, position: position, quaternion: quaternion})
        })
    }

    onClienSpawnRequest = (playerID) =>
    {
        const newPlayerObject3D = new THREE.Object3D()
        newPlayerObject3D.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
        newPlayerObject3D.lookAt(new THREE.Vector3())
        newPlayerObject3D.rotateY(Math.PI)

        this.players[socket.id] = newPlayerObject3D
        const {position, quaternion} = {...newPlayerObject3D}

        socket.emit('server:spawn-response', {position: position, quaternion: quaternion})
        console.log(`Players connected: [${Object.keys(this.players)}]`)
    }



    initScene()
    {
        console.log('Scene initialized')
    }

}

export default Game
