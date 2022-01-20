import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

class Player
{
    constructor(camera, domElement)
    {
        this.camera = camera
        this.domElement = domElement

        this.controls = new PointerLockControls(camera, domElement)

        this.walkSpeed = 5


        this.isWalking = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }

        this.setupCallbacks()
    }


    getWalkDirections()
    {
        const lookDirection = new THREE.Vector3()
        this.camera.getWorldDirection(lookDirection)

        const backVector = lookDirection.clone().negate()

        const upVector = new THREE.Vector3(0, 1, 0)
        const rightVector = new THREE.Vector3()

        rightVector.crossVectors(lookDirection, upVector)

        const leftVector = rightVector.clone().negate()

        return {
            forward: lookDirection,
            backward: backVector,
            left: leftVector,
            right: rightVector
        }
    }



    setupCallbacks()
    {
        this.domElement.addEventListener('click', () => 
        {

            if(!this.controls.isLocked) {
                this.controls.lock()
            }
        })


        this.controls.addEventListener('lock', () => 
        {
            console.log(`locked`)
        })

        this.controls.addEventListener('unlock', () =>
        {
            console.log(`unlocked`)
        })

        this.controls.addEventListener('change', e => 
        {
        })


        document.body.addEventListener('keydown', e => 
        {
            if(this.controls.isLocked)
            {
                const keyCode = String.fromCharCode(e.keyCode)

                if(keyCode === 'W')
                    this.isWalking.forward = true 
                if(keyCode === 'S')
                    this.isWalking.backward = true
                if(keyCode === 'A')
                    this.isWalking.left = true
                if(keyCode === 'D')
                    this.isWalking.right = true
            }
        })

        document.body.addEventListener('keyup', e =>
        {
            if(this.controls.isLocked)
            {
                const keyCode = String.fromCharCode(e.keyCode)

                if(keyCode === 'W')
                    this.isWalking.forward = false
                if(keyCode === 'S')
                    this.isWalking.backward = false
                if(keyCode === 'A')
                    this.isWalking.left = false
                if(keyCode === 'D')
                    this.isWalking.right = false
            }

        })


    }

    update(dt)
    {
        //this.camera.position.add(this.walkVector.multiplyScalar(this.walkSpeed * dt))

        const walkDirections = this.getWalkDirections()

        const activeWalkDirections = Object.keys(this.isWalking).filter( directionName => { return this.isWalking[directionName] === true })

        const walkVector = new THREE.Vector3()

        // calculate normalized walk vector
        activeWalkDirections.forEach( direction => { walkVector.add( walkDirections[direction]) } ); walkVector.normalize()

        // now scale it by walk speed and dt
        walkVector.multiplyScalar(this.walkSpeed * dt)

        this.camera.position.add(walkVector)
    }

    false
}

export default Player
