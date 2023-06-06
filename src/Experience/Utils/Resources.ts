import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


import EventEmitter from "./EventEmitter";

import { TResource, TLoader, ResourceType } from "../Types/index";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

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
      gltfLoader: new GLTFLoader(),
    }
    this.startLoading();

  }

  startLoading() {

    // Provide a DRACOLoader instance
    const dracoLoader = new DRACOLoader(); 
    dracoLoader.setDecoderPath( 'draco/gltf/' );
    this.loaders.gltfLoader.setDRACOLoader( dracoLoader );

    // Load each source
    for (const source of this.sources) {

      switch (source.type) {
        case ResourceType.TEXTURE: {
          this.loaders.textureLoader.load(
            source.path[0],
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;
        }
        case ResourceType.CUBETEXTURE: {
          this.loaders.cubeTextureLoader.load(
            source.path,
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;
        }
        case ResourceType.FONTTYPE: {
          this.loaders.fontLoader.load(
            source.path[0],
            (font) => {
              this.sourceLoaded(source, font);
            }
          );
          break;
        }
        case ResourceType.GLTFMODEL: {
          this.loaders.gltfLoader.load(source.path[0],
            (model) => {
              this.sourceLoaded(source, model);
          });
          break;
        }
        default:
          break;
      }



/*       if (source.type === ResourceType.TEXTURE) {
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
      } */
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
