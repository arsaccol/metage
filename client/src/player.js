import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

class Player
{
    constructor(camera, domElement, socket)
    {
        this.socket = socket
        this.camera = camera
        this.domElement = domElement

        this.controls = new PointerLockControls(camera, domElement)

        this.walkSpeed = 5


        this.isWalkingState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }

        this.setupCallbacks()
    }

    onMouselookControlsChange = (e) =>
    {
        const {position, quaternion} = this.controls.getObject()
        console.log(`PointerLockControls change event: ${JSON.stringify(e)}`)
        console.log(quaternion)
        console.log(position)

        this.socket.emit('client:player-rotate', {position,quaternion})
    }

    isWalking() {
        return (
            this.isWalkingState.forward ||
            this.isWalkingState.backward ||
            this.isWalkingState.left ||
            this.isWalkingState.right
        )
    }

    // simply returns an array of directions that are active
    activeWalkDirections() {
        return Object.keys(this.isWalkingState).filter( directionName => { return this.isWalkingState[directionName] === true })
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

        this.controls.addEventListener('change', this.onMouselookControlsChange)


        document.body.addEventListener('keydown', e => 
        {
            if(this.controls.isLocked)
            {
                const keyCode = String.fromCharCode(e.keyCode)

                if(keyCode === 'W')
                    this.isWalkingState.forward = true 
                if(keyCode === 'S')
                    this.isWalkingState.backward = true
                if(keyCode === 'A')
                    this.isWalkingState.left = true
                if(keyCode === 'D')
                    this.isWalkingState.right = true
            }
        })

        document.body.addEventListener('keyup', e =>
        {
            if(this.controls.isLocked)
            {
                const keyCode = String.fromCharCode(e.keyCode)

                if(keyCode === 'W')
                    this.isWalkingState.forward = false
                if(keyCode === 'S')
                    this.isWalkingState.backward = false
                if(keyCode === 'A')
                    this.isWalkingState.left = false
                if(keyCode === 'D')
                    this.isWalkingState.right = false
            }

        })
    }

    update(dt)
    {
        //this.camera.position.add(this.walkVector.multiplyScalar(this.walkSpeed * dt))

        if(this.isWalking()) {
            const walkDirections = this.getWalkDirections()
            const getActiveWalkDirections = this.activeWalkDirections()
            const walkVector = new THREE.Vector3()

            // calculate normalized walk vector
            getActiveWalkDirections.forEach( direction => { walkVector.add( walkDirections[direction]) } ); walkVector.normalize()

            // now scale it by walk speed and dt
            walkVector.multiplyScalar(this.walkSpeed * dt)


            this.camera.position.add(walkVector)
        }

    }

    false
}

export default Player
