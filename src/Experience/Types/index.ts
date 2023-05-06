import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// 需要加载的资源 
export enum ResourceType {
  TEXTURE = "texture",
  GLTFMODEL = "gltfModel",
  CUBETEXTURE = "cubeTexture",
  FONTTYPE = "fontType",

}
export enum ESourceName {
  EARTHMAP = "earthMap",
  STONEMAP = "stoneMap",
  STARMAP = "starMap",
  FontTypeRegular = "FontTypeRegular",
  ALLSKILLSMAP = "allSkillsMap",
}
export type TResource = {
  name: string,
  type: ResourceType,
  path: string[],
}
export type TLoader = {
  cubeTextureLoader: THREE.CubeTextureLoader,
  textureLoader: THREE.TextureLoader,
  fontLoader: FontLoader,
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