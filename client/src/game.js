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

        this.socket.emit('client:scene-request')

        this.socket.on('server:scene-response', (sceneJson) => {
            console.log(`Got scene back`)
        })
    }


    setupSceneState()
    {
        this.axesHelper = new THREE.AxesHelper(5)

        this.camera.position.y += 1.5
        this.camera.position.z += 2.5


        const planeGeometry = new THREE.PlaneGeometry()
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.scale.x = 10
        this.plane.scale.y = 10
        this.plane.rotation.x = 3 * Math.PI / 2


        const cubeGeometry = new THREE.BoxGeometry()
        const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff } )
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.cube.position.y += 1 

        this.scene.add(this.plane)
        this.scene.add(this.cube)
        this.scene.add(this.axesHelper)
    }

    
    loop = () =>
    {
        requestAnimationFrame(this.loop)
        const delta = this.clock.getDelta()

        this.player.update(delta)

        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderer.render(this.scene, this.camera)
    }


}

export default Game
