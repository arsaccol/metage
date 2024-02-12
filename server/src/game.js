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
        this.gameState = new GameState({tickRate: this.tickRate})
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

            const deltaTime = this.clock.getDelta()

            this.gameState.update(deltaTime)

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
        //socket.on('client:player-rotate', (data) => { this.gameState.players[socket.id].onPlayerRotate(socket, data) })
        socket.on('client:player-rotate', (rotationData) => { 
            this.gameState.onPlayerRotate({socket, position: rotationData.position, quaternion: rotationData.quaternion})
        })

        socket.on('client:player-start-walk', (walkdata) => {
            console.log('====== PLAYER WALK STARTED ======')
            console.log({walkdata})
            console.log('=================================')

        })

        socket.on('client:player-stop-walk', (event) => {
            console.log('====== PLAYER WALK ENDED ======')
            console.log(event)
            console.log('=================================')

        })

    }

    onDisconnect = (socket) =>
    {
        console.log(`Client with ID ${socket.id} disconnected!`)
        socket.broadcast.emit('other-clients:disconnect-broadcast', socket.id)
        this.gameState.deletePlayer(socket.id)
    }


    initScene()
    {
        console.log('Scene initialized')
    }
}

export default Game
