precision highp float;

uniform vec3 color;
uniform sampler2D map;

varying float vAlpha;


void main() {
    gl_FragColor = vec4(color, vAlpha) *  texture2D(map, gl_PointCoord);;
}