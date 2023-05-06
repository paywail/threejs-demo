import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { gsap } from 'gsap';

import Experience from './Experience';
import EventEmitter from './Utils/EventEmitter';
import Time from './Utils/Time';
import World, { brickItemInfo } from './World';
import { moveDirection, setupEventHandlers } from './Utils/EventHandlers';
export default class PhysicsWorld {
  instance!: CANNON.World;
  defaultMaterial!: CANNON.Material;
  defaultContactMaterial!: CANNON.ContactMaterial;
  experience: Experience;
  time: Time;
  world: World;
  earthBody: CANNON.Body | undefined;
  planeBody: CANNON.Body | undefined;
  needMoveBody: CANNON.Body[] | undefined;
  needMoveGeometry: THREE.Mesh[] | undefined;
  wallOfBrick: CANNON.Body[] | undefined;
  bodyMaterialMap: Map<string, CANNON.Material>;
  busEventEmitter: EventEmitter;

  constructor() {

    this.experience = new Experience();
    this.busEventEmitter = this.experience.BusEventEmitter;
    this.time = this.experience.time;
    this.world = this.experience.world;
    this.needMoveBody = [];
    this.needMoveGeometry = [];
    this.bodyMaterialMap = new Map<string, CANNON.Material>();
    this.setInstance();
    this.setPlane();
    this.setBoundaryWall();
    this.setBall(this.world.ball?.position, this.world.ball?.geometry.parameters.radius);
    this.setWallOfBrick(brickItemInfo);
    this.setText();
    setupEventHandlers();
  }
  private setInstance() {
    this.instance = new CANNON.World();
    this.instance.gravity.set(0, -9.82, 0);
    /*  this.defaultMaterial = new CANNON.Material("default");
     this.defaultContactMaterial = new CANNON.ContactMaterial(
       this.defaultMaterial,
       this.defaultMaterial,
       {
         friction: 0.1,
         restitution: 0.7,
       }
     );
     this.instance.defaultContactMaterial = this.defaultContactMaterial;
     this.instance.broadphase = new CANNON.SAPBroadphase(this.instance);
     this.instance.allowSleep = true; */
  }
  // 添加物体
  private setBall(pos = { x: 0, y: 0, z: 0 }, radius = 4) {
    const sphereShape = new CANNON.Sphere(radius);
    this.earthBody = new CANNON.Body({
      mass: 9999,
      position: new CANNON.Vec3(pos.x, pos.y, pos.z),
      shape: sphereShape,
    });
    this.instance.addBody(this.earthBody);
    this.needMoveBody?.push(this.earthBody);
    this.needMoveGeometry?.push(this.world.ball!);
    this.setBodyMaterial(this.earthBody, "earthMaterial");

  }
  private setPlane() {
    if (!this.world.plane) return
    const plane = this.world.plane;
    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({
      mass: 0,  //质量为0 表示是一个static
      shape: planeShape,
    });
    planeBody.position.copy(plane.position as any);
    planeBody.quaternion.copy(plane.quaternion as any);
    this.instance.addBody(planeBody);
  }
  private setBoundaryWall() {
    for (let wall of this.world.wallArr) {
      const planeShape = new CANNON.Box(new CANNON.Vec3(87.5, 85, 2.5));
      const planeBody = new CANNON.Body({
        mass: 0,  //质量为0 表示是一个static
        shape: planeShape,
        material: new CANNON.Material({ friction: 0, restitution: 0 })
      });
      planeBody.position.set(wall.position.x, wall.position.y, wall.position.z)
      planeBody.quaternion.copy(wall.quaternion as any);
      this.instance.addBody(planeBody);
    }

  }
  private setWallOfBrick(boxInfo: typeof brickItemInfo) {
    // 先设置下brick的材质

    const narrowBrickShape = new CANNON.Box(new CANNON.Vec3(boxInfo.length * 0.25, boxInfo.height * 0.5, boxInfo.depth * 0.5));
    const LongBrickShape = new CANNON.Box(new CANNON.Vec3(boxInfo.length * 0.5, boxInfo.height * 0.5, boxInfo.depth * 0.5));
    this.wallOfBrick = [];
    for (let i = 0; this.world.wallOfBrick && i < this.world.wallOfBrick?.length; i++) {
      const brick = this.world.wallOfBrick[i];
      let brickBody;

      if (brick.geometry.parameters.width === 4) {
        // 如果是小块的
        brickBody = new CANNON.Body({
          mass: 1,
          shape: narrowBrickShape,
          position: new CANNON.Vec3(brick.position.x, brick.position.y, brick.position.z),
        });
      } else {
        brickBody = new CANNON.Body({
          mass: 1,
          shape: LongBrickShape,
          position: new CANNON.Vec3(brick.position.x, brick.position.y, brick.position.z),
        });
      }
      this.wallOfBrick.push(brickBody);
      this.needMoveBody?.push(brickBody);
      this.needMoveGeometry?.push(brick);
      this.instance.addBody(brickBody);
      this.setBodyMaterial(brickBody, "brickMaterial");
      if (i > 0) continue
      this.setTwoBodyContactMaterial(brickBody, this.earthBody!, 0.1, 0.1);

    }

  }
  private setText() {

    this.busEventEmitter.on("textReady", (e) => {
      for (let i = 0; i < e.characters.length; i++) {
        const character = e.characters[i];
        // const characterInfo = e.characterCoordInfoArr[i];
        const x = character.position.x + character.geometry.geometryInfo.minX + character.geometry.geometryInfo.length * 0.5;
        const y = character.position.y + character.geometry.geometryInfo.minX + character.geometry.geometryInfo.height * 0.5;
        const z = character.position.z + character.geometry.geometryInfo.minX + character.geometry.geometryInfo.depth * 0.5;

        const boxShape = new CANNON.Box(new CANNON.Vec3(character.geometry.geometryInfo.length * 0.5, character.geometry.geometryInfo.height * 0.5, character.geometry.geometryInfo.depth * 0.5));
        const boxBody = new CANNON.Body({
          shape: boxShape,
          mass: 1,
          position: new CANNON.Vec3(x, y, z),
        });
        this.instance.addBody(boxBody);
        this.needMoveBody?.push(boxBody);
        this.needMoveGeometry?.push(character);
        this.setBodyMaterial(boxBody, "brickMaterial");
        if (i > 0) continue
        // this.setTwoBodyContactMaterial(boxBody, this.earthBody!, 0.9, 0);
      }
    })
  }


  // 其它操作
  private setBodyMaterial(body: CANNON.Body, bodyMaterialName = "defaultMaterial") {
    let bodyMaterial = null;
    if (this.bodyMaterialMap.has(bodyMaterialName)) {
      bodyMaterial = this.bodyMaterialMap.get(bodyMaterialName)!;
    } else {
      bodyMaterial = new CANNON.Material(bodyMaterialName);
      this.bodyMaterialMap.set(bodyMaterialName, bodyMaterial);
    }
    body.material = bodyMaterial;

  }
  private setTwoBodyContactMaterial(ABody: CANNON.Body, BBody: CANNON.Body, friction: number, restitution: number) {
    if (!ABody.material || !BBody.material) return
    const contactMaterial = new CANNON.ContactMaterial(
      ABody.material,
      BBody.material,
      {
        friction,
        restitution,
      }
    );
    this.instance.addContactMaterial(contactMaterial);
  }
  private moveAndRotationEarth() {
    if (!this.earthBody) return
    const [x, y, z] = this.earthBody?.position.toArray();
    let moveToX = (moveDirection.right - moveDirection.left) * 1.5 + x;
    let moveToY = 0 + y;
    let moveToZ = -(moveDirection.forward - moveDirection.back) * 1.5 + z;
    if (moveToX === 0 && moveToY === 0 && moveToZ === 0) return
    gsap.to(this.earthBody.position, {
      x: moveToX,
      z: moveToZ,
      duration: 0.3,
    })

    const axisX = moveDirection.back - moveDirection.forward;
    const axisZ = moveDirection.left - moveDirection.right;
    // 这里直接修改three.js中物体的旋转角度，不会改CANON.js中的
    gsap.to(this.world.ball?.rotation!, {
      x: axisX * Math.PI * 0.1 + this.world.ball?.rotation.x!,
      z: axisZ * Math.PI * 0.1 + this.world.ball?.rotation.z!,
      duration: 0.1,
    })

  }

  update() {
    this.moveAndRotationEarth();
    if (this.needMoveBody && this.needMoveGeometry) {
      for (let i = 0; i < this.needMoveBody.length; i++) {
        if (this.needMoveGeometry[i].geometry.type !== "TextGeometry") {
          this.needMoveGeometry[i].position.copy(this.needMoveBody[i].position as any);
          this.needMoveGeometry[i].quaternion.copy(this.needMoveBody[i].quaternion as any);
        } else {
          // 文字
          const x = this.needMoveBody[i].position.x - this.needMoveGeometry[i].geometry.geometryInfo.center.x;
          const y = this.needMoveBody[i].position.y - this.needMoveGeometry[i].geometry.geometryInfo.center.y;
          const z = this.needMoveBody[i].position.z - this.needMoveGeometry[i].geometry.geometryInfo.center.z;
          this.needMoveGeometry[i].position.set(x, y, z);

          this.needMoveGeometry[i].quaternion.copy(this.needMoveBody[i].quaternion as any);
        }
      }
    }
    this.instance.step(1 / 60, this.time.delta / 1000, 3);
  }
}