import * as THREE from 'three'
import { Server } from 'socket.io'

class Game
{
    constructor()
    {
        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        this.initScene()


        console.log(`Starting game server  ${process.env.SOCKET_PORT}!`)
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

        this.io.on('connection', socket => {
            console.log(`${socket.id} connected to server at ${new Date().toISOString()}!`)

            socket.on('client:scene-request', () => {
                console.log(`[${new Date().toISOString()}] Got a request for the scene state from socket with id: "${socket.id}"`)
            })

            socket.on('client:scene-request', () => {
                console.log(`Scene requested from client ${socket.id}!`)
                const sceneJson = this.scene.toJSON()
                socket.emit('server:scene-response', sceneJson)
                console.log(`Scene sent to client ${socket.id}!`)
            })

        })



    }

    initScene()
    {
        this.axesHelper = new THREE.AxesHelper(5)
        const planeGeometry = new THREE.PlaneGeometry()
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.scale.x = 10
        this.plane.scale.y = 10
        this.plane.rotation.x = 3 * Math.PI / 2

        const cubeGeometry = new THREE.BoxGeometry()
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.cube.position.y += 1

        this.scene.add(this.plane)
        this.scene.add(this.cube)
        this.scene.add(this.axesHelper)
    }

}

export default Game
