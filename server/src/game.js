import * as THREE from 'three'
import { Server } from 'socket.io'
import GameState from './game-state.js'

class Game
{
    constructor()
    {
        this.tickRate = 30 // FPS, but without a frame; tentative value
        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        this.initScene()
        this.gameState = new GameState()
        //this.players = {}


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
        /////////////////////////////////////////////////////////////////////
            // for now, there's no compensation for the case
            // where game loop iterations take longer than the tick rate
        /////////////////////////////////////////////////////////////////////

        let frameCount = 0n

        // actual game loop iteration 
        setInterval( () => {

            frameCount += 1n

            // print delta time every second
            //if(frameCount % BigInt(this.tickRate) === 0n)
            //    console.log(`Delta time: ${1 / this.clock.getDelta()}`)

        }, 1 / this.tickRate * 1000)
    }

    initNetworkEvents()
    {
        this.io.on('connection', this.onConnection)
    }

    onConnection = (socket) => 
    {
        console.log(`${socket.id} connected to server at ${new Date().toISOString()}!`)
        socket.on('disconnect', () => { this.onDisconnect(socket) })

        socket.on('client:spawn-request', () => { this.gameState.onClientSpawnRequest(socket) })
    }

    onDisconnect = (socket) =>
    {
        console.log(`Client with ID ${socket.id} disconnected!`)
        socket.broadcast.emit('other-clients:disconnect-broadcast', socket.id)
        delete this.gameState.players[socket.id]
    }


    initScene()
    {
        console.log('Scene initialized')
    }

}

export default Game
