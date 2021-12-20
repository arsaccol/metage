import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as THREE from 'three'

class Controls
{
    constructor(camera, domElement)
    {
        this.camera = camera
        this.domElement = domElement

        this.controls = new PointerLockControls(camera, domElement)

        this.setupControls()
    }

    walkDirectionsCallback = (e) =>
    {
        if(this.controls.isLocked) 
        {
            const keyCode = String.fromCharCode(e.keyCode)

            const lookDirection = new THREE.Vector3()
            this.camera.getWorldDirection(lookDirection)
            const backVector = lookDirection.clone().negate()

            const upVector = new THREE.Vector3(0, 1, 0) // we don't update the up vector after getting the right vector
            const rightVector = new THREE.Vector3()

            rightVector.crossVectors(lookDirection, upVector)

            const leftVector = rightVector.clone().negate()

            this.keystoDirections = {
                W: lookDirection,
                S: backVector,
                A: leftVector,
                D: rightVector
            }

            const walkVector = new THREE.Vector3()

            Object.keys(this.keystoDirections).map( k => {
                if(keyCode === k)
                    walkVector.add( this.keystoDirections[k] )
            })

            console.log(`Walk vector: ${JSON.stringify(walkVector)}`)

            const walkBeginEvent = new CustomEvent('walk-begin', {
                detail: {
                    walkVector: walkVector.normalize()
                }
            })

            console.log(`walkBeginEvent: ${JSON.stringify(walkBeginEvent)}`)

            document.body.dispatchEvent(walkBeginEvent)

            

        }
    }

    stopWalkingCallback = (e) =>
    {
        if(this.controls.isLocked)
        {
            const walkEndEvent = new CustomEvent('walk-end')
            document.body.dispatchEvent(walkEndEvent)
        }


    }

    setupControls()
    {
        this.domElement.addEventListener('click', () => {
            if(!this.controls.isLocked)
                this.controls.lock()
        })


        this.controls.addEventListener('lock', () => {
            console.log(`locked`)
        })

        this.controls.addEventListener('unlock', () => {
            console.log(`unlocked`)
        })

        this.controls.addEventListener('change', (e)  => {
        })

        document.addEventListener('keydown', this.walkDirectionsCallback)

        document.addEventListener('keyup', this.stopWalkingCallback)
        {
            if(this.controls.isLocked)
            {
            }
        }



    }
}

export default Controls
