import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

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
            console.log('key down!')
        })

    }


}

export default Controls
