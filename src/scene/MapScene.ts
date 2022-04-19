import * as three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Scene } from "./Scene";

export class MapScene implements Scene {
    readonly Scene = true;

    private readonly mapPath = 'static/models/Map1.gltf';
    private readonly gltfLoader = new GLTFLoader();
    private model: three.Object3D;

    load(worldScene: three.Scene): void {
        if (!this.model) {
            this.gltfLoader.load(this.mapPath, (gltf) => {
                this.model = gltf.scene;
                this.model.castShadow = true;
                this.model.position.z = 20;
                this.model.position.x = -40;
                this.model.rotateX(Math.PI / 4)
                this.model.rotateY(Math.PI / 3)
                worldScene.add(this.model);
            });
        } else {
            worldScene.add(this.model);
        }
    }

    clear(worldScene: three.Scene): void {
        if (this.model) {
            worldScene.remove(this.model);
        }
    }

    update(dt: number): void {
        
    }
    
}