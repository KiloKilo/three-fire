precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

attribute vec3 position;
attribute float duration;
attribute float delay;
attribute float distance;

varying float vAlpha;

void main() {

    float t = time - delay;
    float elapsed = mod(t, duration) / duration;
    vec3 pos = position;
    pos.y += elapsed * distance;
    float n = snoise3(pos * 0.75);
    pos.x += n * 1.25 * elapsed;
    pos.z += n * 1.25 * elapsed;
    pos.y += n * 0.1;

    float a = max(elapsed - 0.75, 0.0) * 10.0;
    vAlpha = 1.0 - a;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (20.0 / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}