import {update} from '@tweenjs/tween.js'
import {AxesHelper, GridHelper, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer,} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {Fire} from './Fire'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const params = {
    bloomStrength: 2,
    bloomThreshold: 0.58,
    bloomRadius: 0.5,
    color: '#fc7a45',
    sparks: '#fc7a45',
}

gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
    console.log(value)
    bloomPass.threshold = Number(value)
})

gui.add(params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
    bloomPass.strength = Number(value)
})

gui.add(params, 'bloomRadius', 0.0, 1.0)
    .step(0.01)
    .onChange(function (value) {
        bloomPass.radius = Number(value)
    })

gui.addColor(params, 'color').onChange(function (value) {
    fire.setColor(value)
})

gui.addColor(params, 'sparks').onChange(function (value) {
    fire.setSparksColor(value)
})


const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
bloomPass.threshold = params.bloomThreshold
bloomPass.strength = params.bloomStrength
bloomPass.radius = params.bloomRadius

const bloomComposer = new EffectComposer(renderer)
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

const fire = new Fire(scene)
fire.setColor(params.color)
fire.setSparksColor(params.color)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 2, 10)

scene.add(new GridHelper())
scene.add(new AxesHelper(5))

const lookAt = new Vector3()

function resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    bloomComposer.setSize(width, height)
}

function animate(time) {
    requestAnimationFrame(animate)
    update(time)
    controls.update()
    camera.getWorldPosition(lookAt)
    fire.update(time, lookAt)
    bloomComposer.render()
}

window.addEventListener('resize', resize)
resize()
animate()
