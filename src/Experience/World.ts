import * as  THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { gsap } from "gsap";


import Experience from "./Experience";
import Resources from "./Utils/Resources";
import EventEmitter from "./Utils/EventEmitter";
import { ESourceName, TPosition, TtextInfo, TShape, TRotationInfo } from "./Types";

const ballPosition = {
  x: 0, y: 10, z: 0,
}
export const brickItemInfo = {
  numberOfRow: 6,
  length: 8,
  height: 4,
  depth: 4,
  originPos: {
    x: 10,
    y: 2,
    z: - 50
  }
}
export default class World {
  private experience: Experience;
  private scene: THREE.Scene;
  ball!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial> | undefined;
  resources: Resources | undefined;
  brick: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial> | undefined;
  wallOfBrick: any[] | undefined;
  parameters: { count: number; size: number; radius: number; branches: number; spin: number; randomness: number; randomnessPow: number; inSideColor: string; outSideColor: string; } | undefined;
  textGroups: THREE.Group[] | undefined;
  busEventEmitter: EventEmitter;
  wallArr: THREE.Mesh[];
  plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial> | undefined;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.busEventEmitter = this.experience.BusEventEmitter;
    this.wallArr = [];
    // 添加五个平面，四个边和一个底
    this.setPlane({ x: 0, y: 0, z: 0 }, { width: 175, height: 175 }, { axis: new THREE.Vector3(1, 0, 0), angle: - Math.PI / 2 }, false);
    // this.setPlane({ x: 0, y: 0, z: -20 }, { width: 175, height: 100 });
    // this.setPlane({ x: 175 * 0.5, y: 0, z: 0 }, { width: 175, height: 10 }, { axis: new THREE.Vector3(0, -1, 0), angle: Math.PI / 2 });

    // this.setPlane({ x: 0, y: 0, z: 175 * 0.5 }, { width: 175, height: 10 }, { axis: new THREE.Vector3(-1, 0, 0), angle: Math.PI });
    // this.setPlane({ x: -175 * 0.5, y: 0, z: 0 }, { width: 175, height: 10 }, { axis: new THREE.Vector3(0, 1, 0), angle: Math.PI / 2 });
    this.setBall(ballPosition);
    this.setWallOfBrick(brickItemInfo);
    this.setGalaxy();
    this.setText({ x: 10, y: 0, z: 10 }, {
      content: "HELLOWORLD",
      gap: 2,
    });
    this.setMapToPlane(ESourceName.ALLSKILLSMAP, { x: -40, y: 0.1, z: 40 }, 40, 40);
  }

  // 平面
  private setPlane(pos: TPosition, size: TShape, rotationInfo: TRotationInfo = { axis: new THREE.Vector3(0, 0, 0), angle: 0 }, isWall = true) {

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(size.width, size.height),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      })
    );
    plane.geometry.computeBoundingBox();
    plane.position.set(pos.x, pos.y, pos.z);
    plane.rotateOnAxis(rotationInfo.axis, rotationInfo.angle);
    plane.receiveShadow = true;
    this.scene.add(plane);
    isWall ? this.wallArr.push(plane) : this.plane = plane;
  }


  private setBall(pos: TPosition = { x: 0, y: 0, z: 0 }, radius = 4) {

    //threeJS Section
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshLambertMaterial());
    this.resources?.on("ready", () => {
      // 资源加载好了
      this.ball!.material.map = this.resources?.items[ESourceName.EARTHMAP];
      this.ball!.material.needsUpdate = true;
    })
    this.ball.geometry.computeBoundingSphere();
    this.ball.geometry.computeBoundingBox();
    this.ball.position.set(pos.x, pos.y, pos.z);
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.scene.add(this.ball);
  }
  private setWallOfBrick(brickInfo: typeof brickItemInfo) {
    this.wallOfBrick = [];
    const material = new THREE.MeshLambertMaterial();
    let isOdd = 0, currentLength = brickInfo.length;
    // 奇数行七块， 偶数行六块
    for (let i = 0; i < brickInfo.numberOfRow; i++) { //行
      isOdd = i % 2 === 0 ? 0 : 1;
      for (let j = 0; j < brickInfo.numberOfRow + isOdd; j++) { //列
        let lastNeedSubtraction = 0;
        if (isOdd && (j === 0 || j === brickInfo.numberOfRow)) {
          currentLength *= 0.5;
        }
        const brick = new THREE.Mesh(new THREE.BoxGeometry(currentLength, brickInfo.height, brickInfo.depth, 1, 1, 1),
          material
        );
        j === brickInfo.numberOfRow ? lastNeedSubtraction = brickInfo.length * 0.5 : "";
        brick.position.set(brickInfo.originPos.x + brickInfo.length * j - isOdd * currentLength * 0.5 - lastNeedSubtraction, brickInfo.originPos.y + brickInfo.height * i, brickInfo.originPos.z);
        this.wallOfBrick.push(brick);
        brick.castShadow = true;
        this.scene.add(brick);
        currentLength = brickInfo.length;

      }
    }
    this.resources?.on("ready", () => {
      // 资源加载好了
      if (!this.wallOfBrick) return
      for (let brick of this.wallOfBrick) {
        brick.material.map = this.resources?.items[ESourceName.STONEMAP];
        brick.material.needsUpdate = true;
      }
    });
  }
  private setGalaxy() {
    this.parameters = {
      count: 50000,
      size: 0.5,
      radius: 170,
      branches: 5,
      spin: 1,
      randomness: 20,
      randomnessPow: 50,
      inSideColor: "#ff6030",
      outSideColor: "#1b3984",
    }
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;
    /* geometry */

    /*  if (points ) {
       geometry?.dispose();
       material?.dispose();
       this.scene.remove(points);
     } */
    geometry = new THREE.BufferGeometry()
    const positionsArray = new Float32Array(this.parameters.count * 3);
    const colorArray = new Float32Array(this.parameters.count * 3);
    const inSideColor = new THREE.Color(this.parameters.inSideColor);
    const outSideColor = new THREE.Color(this.parameters.outSideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      // particle 相对于中心的距离，
      const radius = this.parameters.radius * Math.random();
      // i % parameters.branches 表示落到第几个分支，然后 / parameter.branches 将落到0-1的范围内，在 * (Math.PI *2) 就是具体的偏移角度
      const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;
      // 该particle的位置 * 乘一个偏移的角度
      const spinAngle = radius * this.parameters.spin;

      const randomX = (Math.random() ** this.parameters.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * this.parameters.randomness;
      // const randomX = (Math.random() * 0.5) * parameters.randomness;  

      const randomY = (Math.random() ** this.parameters.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * this.parameters.randomness;
      const randomZ = (Math.random() ** this.parameters.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * this.parameters.randomness;

      positionsArray[i3 + 0] = (Math.cos(branchAngle + spinAngle) + randomX) * radius;
      positionsArray[i3 + 1] = -20 + randomY;
      positionsArray[i3 + 2] = (Math.sin(branchAngle + spinAngle) + randomZ) * radius;

      const mixColor = inSideColor.clone();
      // 第二个参数
      mixColor.lerp(outSideColor, radius / this.parameters.radius);
      colorArray[i3 + 0] = mixColor.r;
      colorArray[i3 + 1] = mixColor.g;
      colorArray[i3 + 2] = mixColor.b;

    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    // material
    material = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })
    points = new THREE.Points(geometry, material);
    this.scene.add(points);
  }

  private setText(pos: TPosition, textInfo: TtextInfo) {
    const contentLength = textInfo.content.length;
    if (!contentLength) return
    if (!this.textGroups) {
      this.textGroups = [];
    }

    this.resources?.on('ready', () => {
      // 这一个文本的group

      const font = this.resources?.items[ESourceName.FontTypeRegular];

      const matLite = new THREE.MeshBasicMaterial({
        color: textInfo.color || "#eced8b",
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });

      const characters = [];
      let preTextWidth = 0;
      for (let i = 0; i < textInfo.content.length; i++) {
        const c = textInfo.content[i];
        const geometry = new TextGeometry(c, {
          font: font,
          size: 5,
          height: 5,
        });

        const character = new THREE.Mesh(geometry, matLite);
        this.getGeometryWidthOrHeight(geometry);
        character.position.set(pos.x + preTextWidth, pos.y, pos.z);

        preTextWidth += (character.geometry.geometryInfo.length + textInfo.gap);
        characters.push(character);
        this.scene.add(character);

      }
      this.busEventEmitter.trigger("textReady", { characters });
    })
  }

  private setMapToPlane(imgName: string, pos: TPosition, width: number, height: number) {
    // word text
    const activitiesGeometry = new THREE.PlaneGeometry(width, height);
    this.resources?.on("ready", () => {
      const activitiesTexture = this.resources?.items[imgName];
      activitiesTexture.magFilter = THREE.NearestFilter;
      activitiesTexture.minFilter = THREE.LinearFilter;
      var activitiesMaterial = new THREE.MeshBasicMaterial({
        alphaMap: activitiesTexture,
        transparent: true,
      });

      activitiesMaterial.depthWrite = true;
      activitiesMaterial.depthTest = true;
      let activitiesText = new THREE.Mesh(activitiesGeometry, activitiesMaterial);
      activitiesText.position.x = pos.x;
      activitiesText.position.y = pos.y;
      activitiesText.position.z = pos.z;
      activitiesText.rotation.x = -Math.PI * 0.5;
      activitiesText.renderOrder = 1;
      this.scene.add(activitiesText);
    })


  }

  // 一些工具函数
  private getGeometryWidthOrHeight(geometry: THREE.ExtrudeGeometry) {

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.geometryInfo = {};
    geometry.geometryInfo.length = geometry.boundingBox?.max.x! - geometry.boundingBox?.min.x!;
    geometry.geometryInfo.height = geometry.boundingBox?.max.y! - geometry.boundingBox?.min.y!;
    geometry.geometryInfo.depth = geometry.boundingBox?.max.z! - geometry.boundingBox?.min.z!;
    geometry.geometryInfo.center = geometry.boundingSphere?.center;
    geometry.geometryInfo.maxX = geometry.boundingBox?.max.x!;
    geometry.geometryInfo.minX = geometry.boundingBox?.min.x!;

    return geometry;
  }
  // 更新每一帧
  update() {
  }
}
