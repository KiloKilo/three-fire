precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec2 uv;
attribute vec3 position;
attribute mat4 instanceMatrix;
attribute float dissolve;

varying vec2 vUv;
varying float vDissolve;

void main() {
    vUv = uv;
    vDissolve = dissolve;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}