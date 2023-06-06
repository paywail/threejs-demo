import * as THREE from 'three';

import galaxyVertexShader from '@/shaders/galaxy/vertex.glsl';
import galaxyFragmentShader from '@/shaders/galaxy/fragment.glsl';
import Experience from '../Experience';

interface GalaxyPara {
  experience: Experience;
  scene: THREE.Scene;
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPow: number;
  inSideColor: string;
  outSideColor: string;
}

export default class Galaxy {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  points: THREE.Points | null = null;
  parameters: GalaxyPara;
  scene: THREE.Scene;
  experience: Experience;
  clock: THREE.Clock;
  constructor(parameters: GalaxyPara) {
    this.parameters = parameters;
    this.scene = parameters.scene;
    this.experience = parameters.experience;
    this.clock = new THREE.Clock();

    this.geometry = new THREE.BufferGeometry();

    const positionsArray = new Float32Array(this.parameters.count * 3);
    const colorArray = new Float32Array(this.parameters.count * 3);
    const randomness = new Float32Array(this.parameters.count * 3);
    const scales = new Float32Array(this.parameters.count);

    const inSideColor = new THREE.Color(this.parameters.inSideColor);
    const outSideColor = new THREE.Color(this.parameters.outSideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      // particle 相对于中心的距离，
      const radius = this.parameters.radius * Math.random();

      // i % parameters.branches 表示落到第几个分支，然后 / parameter.branches 将落到0-1的范围内，再 * (Math.PI *2) 就是具体的偏移角度
      const branchAngle = ((i % this.parameters.branches) / this.parameters.branches) * Math.PI * 2;

      // 相对于该点的随机偏移量
      const randomX = Math.random() ** this.parameters.randomnessPow * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomY = Math.random() ** this.parameters.randomnessPow * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomZ = Math.random() ** this.parameters.randomnessPow * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;

      positionsArray[i3 + 0] = Math.cos(branchAngle) * radius;
      positionsArray[i3 + 1] = -20;
      positionsArray[i3 + 2] = Math.sin(branchAngle) * radius;

      randomness[i3 + 0] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      const mixColor = inSideColor.clone();
      // 第二个参数
      mixColor.lerp(outSideColor, radius / this.parameters.radius);
      colorArray[i3 + 0] = mixColor.r;
      colorArray[i3 + 1] = mixColor.g;
      colorArray[i3 + 2] = mixColor.b;

      // scale
      scales[i] = Math.random();
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
    this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    // material
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: galaxyVertexShader,
      fragmentShader: galaxyFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: {
          value: 800.0,
        },
      },
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
    this.animate();
  }
  animate() {
    const elapsedTime = this.clock.getElapsedTime();

    // Update material
    this.material.uniforms.uTime.value = elapsedTime;

    window.requestAnimationFrame(this.animate.bind(this));
  }
}
