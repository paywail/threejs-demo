import * as THREE from "three";
import Stats from 'stats.js';

import Experience from "./Experience";

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  sunLight: THREE.DirectionalLight | undefined;
  hemisphereLight: THREE.HemisphereLight | undefined;
  stats: Stats | undefined;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setHemisphereLight();
    this.setSunLight();
    this.setStats();

  }
  setHemisphereLight() {
    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    this.hemisphereLight.color.setHSL(0.6, 0.6, 0.6);
    this.hemisphereLight.groundColor.setHSL(0.1, 1, 0.4);
    this.hemisphereLight.position.set(0, 50, 0);
    this.scene.add(this.hemisphereLight);
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#fff", 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(100, 100, - 2.25);

    const directionLightCamera = this.sunLight.shadow.camera;
    directionLightCamera.near = 5;
    directionLightCamera.far = 225;
    directionLightCamera.top = 100;
    directionLightCamera.right = 100;
    directionLightCamera.bottom = -100;
    directionLightCamera.left = -100;
    this.sunLight.shadow.radius = 30;
    this.scene.add(this.sunLight);

    const directionalLightCameraHelper = new THREE.CameraHelper(directionLightCamera);
    this.scene.add(directionalLightCameraHelper);
    directionalLightCameraHelper.visible = false;
  }
  setStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }
}