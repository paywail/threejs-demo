import * as THREE from "three";

import Experience from "./Experience";
import Camera from "./Camera";
import Size from "./Utils/Size";


export default class Renderer {
  experience: Experience;
  instance: THREE.WebGLRenderer | undefined;
  sizes: Size;
  scene: THREE.Scene;
  camera: Camera;
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.setInstance();
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.experience.canvas,
      antialias: true,  //抗锯齿
    });
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }
  resize() {
    this.instance?.setSize(this.sizes.width, this.sizes.height);
    this.instance?.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }
  update() {
    this.instance?.render(this.scene, this.camera.instance);
  }
}