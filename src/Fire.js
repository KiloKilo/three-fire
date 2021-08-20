import { FireParticle } from './FireParticle'
import {
    Color,
    DynamicDrawUsage,
    Group,
    InstancedBufferAttribute,
    InstancedMesh,
    PlaneBufferGeometry,
    RawShaderMaterial,
    TextureLoader,
} from 'three'
import Sparks from './Sparks'
import vertexShader from './fire.vert'
import fragmentShader from './fire.frag'
import tex from './tex.png'

export class Fire {
    constructor(parent) {
        this.object = new Group()
        this.particles = []
        this.delay = 250
        this.count = 10
        this.lastTime = performance.now()

        this.sparks = new Sparks(this.object)

        for (let i = 0; i < this.count; i++) {
            this.particles.push(new FireParticle(this.object))
        }

        const dissolves = new Float32Array(this.count).fill(1)
        const geometry = new PlaneBufferGeometry()
        geometry.setAttribute('dissolve', new InstancedBufferAttribute(dissolves, 1, true, 1))

        const material = new RawShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthTest: false,
            uniforms: {
                map: { value: new TextureLoader().load(tex) },
                color: { value: new Color(0xff6000) },
            },
        })

        this.mesh = new InstancedMesh(geometry, material, this.count)
        this.mesh.instanceMatrix.setUsage(DynamicDrawUsage)

        this.object.add(this.mesh)
        parent.add(this.object)
    }

    setColor(color) {
        this.mesh.material.uniforms.color.value.setStyle(color)
    }

    setSparksColor(color) {
        this.sparks.setColor(color)
    }

    start() {
        const particle = this.particles.find((particle) => !particle.isRunning)
        particle?.start()
    }

    update(time, lookAt) {
        if (time - this.lastTime > this.delay) {
            this.lastTime = time
            this.start()
        }

        this.sparks.update(time, lookAt)

        for (let i = 0; i < this.count; i++) {
            this.mesh.setMatrixAt(i, this.particles[i].matrix)
            this.mesh.geometry.attributes.dissolve.array[i] = this.particles[i].dissolve
        }

        this.mesh.lookAt(lookAt)
        this.mesh.instanceMatrix.needsUpdate = true
        this.mesh.geometry.attributes.dissolve.needsUpdate = true

    }
}
