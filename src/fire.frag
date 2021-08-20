precision highp float;

uniform sampler2D map;
uniform vec3 color;

varying vec2 vUv;
varying float vDissolve;

void main() {
    float a = texture2D(map, vUv).a;
    float s = smoothstep(vDissolve - 0.05, vDissolve + 0.05, a);

    gl_FragColor = vec4(color, s);
}