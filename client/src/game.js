import * as THREE from 'three'
import { JSONLoader } from 'three'

import Player from './player'
import { io } from 'socket.io-client'

class Game
{
    constructor()
    {
        console.log(`Running game constructor!`)
        this.init()
        this.setupSceneState()
        this.setupSocket()
    }

    init()
    {
        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.element = document.body.appendChild(this.renderer.domElement)
        this.player = new Player(this.camera, this.element)
        this.players = {}
    }

    setupSocket()
    {
        this.socket = io(`http://localhost:${SOCKET_PORT}/`, {
            cors: {
                origin: `http://localhost/${CLIENT_PORT}`,
                methods: ['GET', 'POST']
            }
        })


        this.socket.on('connect', this.onConnect)


        this.socket.on('connect_error', (err) => {
            console.warn(`connect_error due to ${err.message}`)

        })
    }

    onConnect = () => 
    {
        console.log(`Socket with ID ${this.socket.id} connected!`)

        this.socket.emit('client:spawn-request')

        this.socket.on('server:spawn-response', (playerObject3D) => {
            console.log('Player spawned in server!')
            const {position, quaternion} = playerObject3D
            this.camera.position.set(position.x, position.y, position.z)
            this.camera.rotation.setFromQuaternion(quaternion)
            this.scene.add(this.camera)
        })

        this.socket.on('other-clients:spawn-broadcast', this.onOtherClientsSpawnBroadcast)
    }

    onOtherClientsSpawnBroadcast = (newPlayer) => 
    {
        console.log(`Another player connected! ${JSON.stringify(newPlayer)}`)
        const {id, position, quaternion} = newPlayer
        console.log(`ID: ${id} Position: ${JSON.stringify(position)} Quaternion: ${JSON.stringify(quaternion)}`)

        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({color: Math.floor(Math.random() * 99999)})

        this.players[id] = new THREE.Mesh(geometry, material)
        this.scene.add(this.players[id])
        this.players[id].position.x += position.x
        this.players[id].position.y += position.y
        this.players[id].position.z += position.z
        this.players[id].rotation.setFromQuaternion(quaternion)
    }



    setupSceneState()
    {
        this.axesHelper = new THREE.AxesHelper(5)

        this.camera.position.y += 1.5
        this.camera.position.z += 2.5
        this.camera.position.x += 3.0
        this.camera.lookAt(new THREE.Vector3())


        const planeGeometry = new THREE.PlaneGeometry(100, 100)
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x007700 })
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.rotation.x = 3 * Math.PI / 2



        this.scene.add(this.plane)
        this.scene.add(this.axesHelper)
    }

    
    loop = () =>
    {
        requestAnimationFrame(this.loop)
        const delta = this.clock.getDelta()

        this.player.update(delta)

        this.renderer.render(this.scene, this.camera)
    }


}

export default Game
