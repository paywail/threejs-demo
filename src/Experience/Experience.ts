import * as THREE from "three";

import Camera from "./Camera";
import EventEmitter from "./Utils/EventEmitter";
import Size from "./Utils/Size";
import Time from "./Utils/Time";
import Renderer from "./Renderer";
import World from "./World";
import Environment from "./Environment";
import Resources from "./Utils/Resources";
import { sources } from "./source";
import PhysicsWorld from "./PhysicsWorld";

let experience: Experience;

export default class Experience {
  canvas: Element | undefined;
  BusEventEmitter!: EventEmitter;
  sizes!: Size;
  time!: Time;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  environment: Environment | undefined;
  resources: Resources | undefined;
  physicsWorld: PhysicsWorld | undefined;

  constructor(canvas?: Element) {

    if (experience) {
      return experience;
    }

    experience = this;
    this.canvas = canvas;

    // 全局的事件总线
    this.BusEventEmitter = new EventEmitter();
    this.sizes = new Size();
    this.time = new Time();
    this.scene = new THREE.Scene();               //场景
    this.camera = new Camera();                   //相机
    this.renderer = new Renderer();               //渲染器
    this.resources = new Resources(sources);      //加载资源

    this.world = new World();                     //三维物体世界
    this.physicsWorld = new PhysicsWorld()        //物理世界
    this.environment = new Environment();         //光啊


    this.sizes.on("resize", () => {
      this.resize();
    })
    this.time.on("tick", () => {
      this.update();
    })

  }
  resize() {

    this.camera.resize();
    this.renderer?.resize();
  }
  // update every frame
  update() {
    this.camera.update();
    this.renderer?.update();
    this.physicsWorld?.update();
    this.world.update();
  }
}