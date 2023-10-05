import * as THREE from 'three'
import { JSONLoader } from 'three'

import Player from './player'
import { io } from 'socket.io-client'

const VITE_GAME_HOST = import.meta.env.VITE_GAME_HOST

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
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.element = document.body.appendChild(this.renderer.domElement)
        this.players = {}
    }

    setupSocket()
    {
        this.socket = io(VITE_GAME_HOST, {
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

        this.player = new Player(this.camera, this.element, this.socket)

        this.socket.on('disconnect', this.onDisconnect)

        this.socket.emit('client:spawn-request')

        this.socket.on('server:spawn-response', ({spawnedPlayer, existingPlayers}) => {
            console.log('Player spawned in server!')
            const {position, quaternion} = spawnedPlayer
            this.camera.position.set(position.x, position.y, position.z)
            this.camera.rotation.setFromQuaternion(quaternion)
            this.scene.add(this.camera)

            existingPlayers.map(player => this.spawnPlayer(player))
        })

        this.socket.on('other-clients:spawn-broadcast', this.onOtherClientsSpawnBroadcast)
        this.socket.on('other-clients:disconnect-broadcast', this.onOtherClientsDisconnectBroadcast)
        this.socket.on('server:other-player-rotated', this.onOtherPlayerRotated)

        this.loop()
    }

    onDisconnect = () => 
    {
        console.log(`Disconnected from server! Reloading...`)

        // by reloading, for now, we prevent ghosts from our previous connections from showing up 
        // as existing players in the server when the server reloads and cuts the connection

        // disconnections should be better handled in the future, though
        location.reload()
    }

    spawnPlayer = ({id, position, quaternion}) =>
    {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({color: Math.floor(Math.random() * 99999)})

        const newPlayer = this.players[id] = new THREE.Mesh(geometry, material)
        this.scene.add(newPlayer)
        newPlayer.position.x += position.x
        newPlayer.position.y += position.y
        newPlayer.position.z += position.z
        newPlayer.rotation.setFromQuaternion(quaternion)
    }

    onOtherClientsSpawnBroadcast = (newPlayer) => 
    {
        console.log(`Another player connected! ${JSON.stringify(newPlayer)}`)
        const {id, position, quaternion} = newPlayer
        console.log(`ID: ${id} Position: ${JSON.stringify(position)} Quaternion: ${JSON.stringify(quaternion)}`)

        if(this.socket.id !== id)
            this.spawnPlayer(newPlayer)
    }

    onOtherClientsDisconnectBroadcast = (clientID) =>
    {
        console.log(`Client with ID ${clientID} disconnected!`)
        const clientAvatarToBeRemoved = this.players[clientID]
        this.scene.remove(clientAvatarToBeRemoved)
    }

    onOtherPlayerRotated = ({id, quaternion, position}) =>
    {
        this.players[id].rotation.setFromQuaternion(quaternion)
        console.log(`Other player with ID ${id} rotated to quaternion ${JSON.stringify(quaternion)}, currently at position: ${JSON.stringify(this.players[id].position)}!`)
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
