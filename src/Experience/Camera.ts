import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Experience from './Experience';
import Size from './Utils/Size';

export default class Camera {
  experience: Experience;
  scene: THREE.Scene;
  sizes: Size;
  canvas: Element | undefined;
  instance!: THREE.PerspectiveCamera;
  controls: OrbitControls | undefined;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.setInstance();
    this.setControls();
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 5000);
    this.instance.position.set(0, 100, 150);
    this.scene.add(this.instance);
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas as HTMLElement);
    this.controls.enableDamping = true;
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.instance.lookAt(this.experience.world.ball?.position!);
    this.controls?.update();
  }
}
