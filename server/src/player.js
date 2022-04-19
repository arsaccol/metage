import * as THREE from 'three'

class Player extends THREE.Object3D
{
    constructor({socketID, position, quaternion})
    {
        super()
        this.socketID = socketID
        this.object3D = new THREE.Object3D()
        this.position.set(position.x, position.y, position.z)
        this.quaternion.set(quaternion)

        this.lookAt(new THREE.Vector3())
        this.rotateY(Math.PI)

        this.isWalking = false
        this.walkSpeed = 5
    }

    update(delta)
    {
        if (this.isWalking)
        {
        }
    }
}

export default Player
