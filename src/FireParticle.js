import { MathUtils, Object3D, Vector3 } from 'three'
import { Easing, Tween } from '@tweenjs/tween.js'

export class FireParticle {
    constructor() {
        this.dissolve = 1
        this.dummy = new Object3D()
    }

    start() {
        this.isRunning = true
        const duration = 2000 + MathUtils.randFloat(-250, 250)
        const startRotation = MathUtils.randFloat(-Math.PI, Math.PI)
        const endRotation = startRotation + MathUtils.randFloat(-0.75, 0.75)
        const scale = 1 + MathUtils.randFloat(-0.25, 0.25)
        const x = MathUtils.randFloat(-0.5, 0.5)
        const y = duration / 900

        this.dummy.scale.set(0, 0, 0)
        this.dummy.position.set(0, 0, 0)
        this.dummy.rotation.set(0, 0, startRotation)
        this.dissolve = 0.03

        new Tween(this.dummy.scale)
            .to(new Vector3(scale, scale, scale), duration * 0.5)
            .easing(Easing.Sinusoidal.Out)
            .start()
        new Tween(this.dummy.position).to(new Vector3(x, y, 0), duration).easing(Easing.Quadratic.In).start()
        new Tween(this.dummy.rotation).to(new Vector3(0, 0, endRotation), duration).start()
        new Tween({ dissolve: this.dissolve })
            .to({ dissolve: 1 }, duration)
            .easing(Easing.Cubic.InOut)
            .onUpdate(({ dissolve }) => this.dissolve = dissolve)
            .onComplete(()=>this.isRunning  =false)
            .start()
    }

    get matrix(){
        this.dummy.updateMatrix()
        return this.dummy.matrix
    }
}
