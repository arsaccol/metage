import * as THREE from 'three'
import { Server } from 'socket.io'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

class Game
{
    constructor()
    {
        // for now, there's no compensation for the case
        // where game loop iterations take longer than the tick rate
        this.tickRate = 30 // FPS, but without a frame; tentative value
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

    // run and define the game loop I guess
    runLoop()
    {
        // actual game loop iteration 
        setInterval( () => {
            console.log(`Delta time: ${1 / this.clock.getDelta()}`)

        }, 1 / this.tickRate * 1000)
    }

    initNetworkEvents()
    {
        this.io.on('connection', this.onConnection)
    }

    onConnection = (socket) => 
    {
        console.log(`${socket.id} connected to server at ${new Date().toISOString()}!`)
        socket.on('disconnect', () => { this.onDisconnect(socket) } )

        socket.on('client:spawn-request', () => {

            console.log(`Spawning new player with ID: ${socket.id}!`)

            const newPlayerObject3D = new THREE.Object3D()
            newPlayerObject3D.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
            newPlayerObject3D.lookAt(new THREE.Vector3())
            newPlayerObject3D.rotateY(Math.PI)

            this.players[socket.id] = newPlayerObject3D
            const {position, quaternion} = {...newPlayerObject3D}

            const stateOfExistingPlayers = Object.keys(this.players).filter(id => id !== socket.id).map( id => {
                const { position, quaternion } = this.players[id]
                return {
                    id: id,
                    position: position,
                    quaternion: quaternion
                }
            } )

            socket.emit('server:spawn-response', {spawnedPlayer: {position: position, quaternion: quaternion}, existingPlayers: stateOfExistingPlayers})

            console.log(`Players connected: [${Object.keys(this.players)}]`)
            socket.broadcast.emit('other-clients:spawn-broadcast', {id: socket.id, position: position, quaternion: quaternion})
        })
    }

    onDisconnect = (socket) =>
    {
        console.log(`Client with ID ${socket.id} disconnected!`)
        socket.broadcast.emit('other-clients:disconnect-broadcast', socket.id)
        delete this.players[socket.id]
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
