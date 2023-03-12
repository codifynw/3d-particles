varying vec3 vPosition;
uniform float uTime;
attribute vec3 aRandom;
uniform float uScale;

void main() {
    vPosition = position;

    float time = uTime * 4.0;

    vec3 pos = position;
    pos.x += sin(time * aRandom.x) * 0.01;
    pos.y += cos(time * aRandom.y) * 0.01;
    pos.z += cos(time * aRandom.z) * 0.01;

    pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale));
    pos.y *= uScale + (cos(pos.z * 4.0 + time) * (1.0 - uScale));
    pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale));

    pos *= uScale;
    
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;
}


// void main() {
//     vPosition = position;

//     float time = uTime * 0.6;

//     vec3 pos = position;
//     pos.x += sin(time * aRandom.x) * 0.01;
//     pos.y += cos(time * aRandom.y) * 0.01;
//     pos.z += cos(time * aRandom.z) * 0.01;

//     pos.x *= uScale + sin(pos.y + time);
//     pos.y *= uScale + cos(pos.z + time);
//     pos.z *= uScale + sin(pos.x + time);
    
//     vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
//     gl_Position = projectionMatrix * mvPosition;
//     gl_PointSize = 8.0 / -mvPosition.z;
// }