varying vec3 vPosition;
varying vec4 vViewPosition; // Add this line
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uCameraPosition; // Add this line

void main() {
  vec3 color = mix(uColor1, uColor2, 1.0);

  // Calculate distance between particle and camera
  float distance = length(uCameraPosition - vViewPosition.xyz);

  // Modify alpha value based on distance
  float minDistance = 10.0;
  float maxDistance = 50.0;
  float alpha = 1.0 - smoothstep(minDistance, maxDistance, distance);

  gl_FragColor = vec4(color, alpha);
}