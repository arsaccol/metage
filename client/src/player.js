import * as THREE from 'three'
import { DefaultLoadingManager } from 'three'

class Player
{
    constructor(camera)
    {
        this.camera = camera
        this.walkSpeed = 10 
        this.walkVector = new THREE.Vector3()
        this.walking = false

        this.setupCallbacks()
    }

    setupCallbacks()
    {
        document.body.addEventListener('walk-begin', e => {
            e.preventDefault()
            console.log(`Started walking!`)
            this.walking = true
            this.walkVector = e.detail.walkVector
        })

        document.body.addEventListener('walk-end', e => {
            e.preventDefault()
            console.log(`Stopped walking!`)
            this.walking = false
            this.walkVector = new THREE.Vector3(0, 0, 0)
        })

    }

    update(dt)
    {
        if(this.walking === true)
        {
            //console.log(`Walk vector ${this.walkVector}`)
            this.camera.position.add(this.walkVector.multiplyScalar(this.walkSpeed * dt))
        }
        //this.camera.position.add(this.walkDirection.
    }

    false
}

export default Player
