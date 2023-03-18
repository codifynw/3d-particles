uniform vec2 resolution;
varying vec3 vPosition;
uniform float uTime;
attribute vec3 aRandom;
uniform float uScale;
varying vec4 vViewPosition; 
uniform float uFov;
uniform float uAspectRatio;

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

  // Calculate distance from the camera
  float distance = length(mvPosition.xyz);

  // Calculate point size based on distance, field of view, and aspect ratio
  float halfFov = radians(uFov) * 0.5;
  float screenSize = 2.0 * distance * tan(halfFov);
  float screenWidth = screenSize * uAspectRatio;
  gl_PointSize = 0.005 * (resolution.x / screenWidth);

    // float pointSize = 20.0 / distance;
// gl_PointSize = 2.0;
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