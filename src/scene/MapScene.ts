import * as three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Scene } from "./Scene";

export class MapScene implements Scene {
    readonly Scene = true;

    private readonly mapPath = 'static/gltf/map/map2.gltf';
    private readonly playerPath = 'static/gltf/soldier/soldier.gltf';
    private readonly gltfLoader = new GLTFLoader();
    private model: three.Object3D;
    private soldier: three.Object3D;

    load(worldScene: three.Scene): void {
        if (!this.model) {
            this.gltfLoader.load(this.mapPath, (mapGltf) => {
                this.model = mapGltf.scene;
                this.model.castShadow = true;
                this.model.position.z = 20;
                this.model.position.x = -40;
                this.model.rotateX(Math.PI / 4)
                this.model.rotateY(Math.PI / 3)
                // worldScene.add(this.model);
                this.gltfLoader.load(this.playerPath, soldierGltf => {
                    this.soldier = soldierGltf.scene;
                    this.soldier.traverse(obj => {
                        if ((obj as any).isMesh) obj.castShadow = true;
                    })
                    this.soldier.castShadow = true;
                    this.soldier.position.z = 40;
                    this.soldier.position.y = -1.5;
                    worldScene.add(this.soldier);
                })
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