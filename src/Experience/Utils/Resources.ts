import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import EventEmitter from "./EventEmitter";

import { TResource, TLoader, ResourceType } from "../Types/index";

export default class Resources extends EventEmitter {
  items: any;
  toLoad: number;
  loaded: number;
  loaders: TLoader;
  sources: TResource[];
  constructor(sources: TResource[]) {
    super();
    this.sources = sources;
    this.toLoad = sources.length;
    this.loaded = 0;
    this.items = {};
    this.loaders = {
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      fontLoader: new FontLoader(),
    }
    this.startLoading();

  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === ResourceType.TEXTURE) {
        this.loaders.textureLoader.load(
          source.path[0],
          (file) => {
            this.sourceLoaded(source, file);
          }
        )
      }
      else if (source.type === ResourceType.CUBETEXTURE) {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          }
        )
      } else if (source.type === ResourceType.FONTTYPE) {
        this.loaders.fontLoader.load(
          source.path[0],
          (font) => {
            this.sourceLoaded(source, font);
          }
        )
      }
    }
  }
  sourceLoaded(source: TResource, file: any) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}
