import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import vertex from "./shader/vertexShader.glsl";
import fragment from "./shader/fragmentShader.glsl";

class Model {
  constructor(obj) {
    this.name = obj.name;
    this.file = obj.url;
    this.scene = obj.scene;
    this.placeOnLoad = obj.placeOnLoad;
    this.isActive = false;
    this.type = obj.type;

    this.color1 = obj.color1;
    this.color2 = obj.color2;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(this.dracoLoader);

    if (this.type === "generated") {
      this.generatePlane();
    } else {
      this.init();
    }

    if (this.placeOnLoad) {
      this.add();
    }
  }

  setupParticles(particlesPosition, particlesRandomness) {
    // Particles Material
    this.particlesMaterial = new THREE.ShaderMaterial({
      blending:  THREE.CustomBlending,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uColor1: { value: new THREE.Color(this.color1) },
        uColor2: { value: new THREE.Color(this.color2) },
        uTime: { value: 0 },
        uScale: { value: 0 },
        uCameraPosition: { value: this.scene.getObjectByProperty('type', 'PerspectiveCamera').position }, // Updated line
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Particles Geometry
    this.particlesGeometry = new THREE.BufferGeometry();
    this.particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlesPosition, 3)
    );

    if (particlesRandomness) {
      this.particlesGeometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(particlesRandomness, 3)
      );
    }

    // Particles
    this.particles = new THREE.Points(
      this.particlesGeometry,
      this.particlesMaterial
    );
  }

  init() {
    this.loader.load(this.file, (response) => {
      this.mesh = response.scene.children[0];

      // Material Mesh
      this.material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
      });
      this.mesh.material = this.material;

      // Geometry Mesh
      this.geometry = this.mesh.geometry;

      // Set up particles
      const numParticles = 20000;
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesRandomness = new Float32Array(numParticles * 3);

      const sampler = new MeshSurfaceSampler(this.mesh).build();
      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set(
          [newPosition.x, newPosition.y, newPosition.z],
          i * 3
        );

        particlesRandomness.set(
          [
            Math.random() * 2 - 1, // - 1 to 1
            Math.random() * 2 - 1, // - 1 to 1
            Math.random() * 2 - 1, // - 1 to 1
          ],
          i * 3
        );
      }

      this.setupParticles(particlesPosition, particlesRandomness);
    });
  }

  generatePlane() {
    const numParticles = 20000;
    const particlesPosition = new Float32Array(numParticles * 3);
    const particlesRandomness = new Float32Array(numParticles * 3);

    const planeWidth = 10;
    const planeDepth = 10;

    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * planeWidth;
      const y = 0;
      const z = (Math.random() - 0.5) * planeDepth;

      particlesPosition.set([x, y, z], i * 3);

      particlesRandomness.set(
        [
          Math.random() * 2 - 1, // - 1 to 1
          Math.random() * 2 - 1, // - 1 to 1
          Math.random() * 2 - 1, // - 1 to 1
        ],
        i * 3
      );
    }

    this.setupParticles(particlesPosition, particlesRandomness);
  }

  add() {
    this.scene.add(this.particles);
    this.isActive = true;

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 1,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.to("body", {
      background: this.background,
      duration: 0.8,
    });
  }

  remove() {
    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 0,
      duration: 0.8,
      ease: "power3.out",
      onComplete: () => {
        this.isActive = false;
        this.scene.remove(this.particles);
      },
    });
  }
}

export default Model;
