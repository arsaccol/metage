import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

class Input
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
            this.controls.lock()
        })


        this.controls.addEventListener('lock', () => {
            console.log(`locked`)
        })

        this.controls.addEventListener('unlock', () => {
            console.log(`locked`)
        })

        this.controls.addEventListener('change', (e)  => {
            console.log(`bugabuga`)

        })

        this.controls.addEventListener('keydown', (e) => {
            console.log('key down!')
        })
        


    }


}

export default Input
