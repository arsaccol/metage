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


        document.body.addEventListener('keydown', (e) => {
            if(this.controls.isLocked) {
                const keyCode = String.fromCharCode(e.keyCode)

                const lookDirection = new THREE.Vector3()
                this.camera.getWorldDirection(lookDirection)

                if( keyCode === 'W') {
                    this.camera.position.add(lookDirection)
                }
                if( keyCode === 'S') {
                    this.camera.position.add(lookDirection.negate())
                    console.log(this.camera.position)
                }
            }
        })
    }


}

export default Controls
