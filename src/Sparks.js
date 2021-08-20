import { BufferAttribute, BufferGeometry, Color, MathUtils, Points, RawShaderMaterial, TextureLoader } from 'three'
import vertexShader from './sparks.vert'
import fragmentShader from './sparks.frag'
import spark from './spark.png'

export default class Sparks {
    constructor(parent) {
        const numParticles = 50

        const positions = new Float32Array(numParticles * 3)
        const scales = new Float32Array(numParticles)
        const durations = new Float32Array(numParticles)
        const delays = new Float32Array(numParticles)
        const distances = new Float32Array(numParticles)

        for (let i = 0; i < numParticles * 3; i += 3) {
            positions[i] = MathUtils.randFloat(-0.25, 0.25)
            positions[i + 2] = MathUtils.randFloat(-0.25, 0.25)
        }

        for (let i = 0; i < numParticles; i++) {
            durations[i] = 2000 + MathUtils.randFloat(-750, 750)
            delays[i] = MathUtils.randFloat(0, 2500)
            distances[i] = 2 + MathUtils.randFloat(-0.5, 0.5)
        }

        const geometry = new BufferGeometry()
        geometry.setAttribute('position', new BufferAttribute(positions, 3))
        geometry.setAttribute('scale', new BufferAttribute(scales, 1))
        geometry.setAttribute('duration', new BufferAttribute(durations, 1))
        geometry.setAttribute('delay', new BufferAttribute(delays, 1))
        geometry.setAttribute('distance', new BufferAttribute(distances, 1))

        const material = new RawShaderMaterial({
            transparent: true,
            uniforms: {
                time: { value: performance.now() },
                color: { value: new Color(0xff0000) },
                map: { value: new TextureLoader().load(spark) },
            },
            vertexShader,
            fragmentShader,
        })

        this.particles = new Points(geometry, material)
        parent.add(this.particles)
    }

    setColor(color) {
        this.particles.material.uniforms.color.value.setStyle(color)
    }

    update(time, lookAt) {
        this.particles.lookAt(lookAt)
        this.particles.material.uniforms.time.value = time
    }
}
