import * as THREE from 'three'

class Game
{
    constructor(socket)
    {
        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        this.initScene()

        this.socket = socket
    }

    initNetworking()
    {
        this.socket.on('client:scene-request', () => {

            const sceneJson = this.scene.toJSON()
            this.socket.emit('server:scene-transfer', sceneJson)
            
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
