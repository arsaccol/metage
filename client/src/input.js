import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

class Input
{
    constructor(camera, domElement)
    {
        this.camera = camera
        this.domElement = domElement

        this.controls = new PointerLockControls(camera, domElement)
    }

    setupControls()
    {
        this.controls.addEventListener('lock', () => {
            console.log(`locked`)
        })

        this.controls.addEventListener('unlock', () => {
            console.log(`locked`)
        })

        this.controls.addEventListener('change', (e)  => {
            console.log(JSON.stringify(e, null, 2))
        })


    }


}

export default Input
