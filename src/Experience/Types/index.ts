import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 需要加载的资源
export enum ResourceType {
  TEXTURE,
  GLTFMODEL,
  CUBETEXTURE ,
  FONTTYPE,
  GLBMODEL,

}
export enum ESourceName {
  EARTHMAP ,
  STONEMAP,
  STARMAP ,
  FontTypeRegular,
  ALLSKILLSMAP,
  LetterBModel,
  LetterBModelCollision,
  MewtwoModel,
}
export type TResource = {
  name: ESourceName,
  type: ResourceType,
  path: string[],
}
export type TLoader = {
  cubeTextureLoader: THREE.CubeTextureLoader,
  textureLoader: THREE.TextureLoader,
  fontLoader: FontLoader,
  gltfLoader: GLTFLoader,
  // dracoLoader: DRACOLoader,
}

// 砖的类型
export type TShape = {
  width: number,
  height: number,
  depth?: number,
}
// 坐标类型
export type TPosition = {
  x: number,
  y: number,
  z: number,
}
// 绕什么轴旋转多少角度
export type TRotationInfo = {
  axis: THREE.Vector3,
  angle: number,
}

// 文本的类型
export type TtextInfo = {
  content: string,
  gap: number,
  fontSize?: number,
  height?: number,
  color?: THREE.Color,
}