import GUI from "lil-gui";
import * as three from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { defaultDebugConfings, registerThreeObjectDefaul } from "../graphics/ThreeDebuggable";
import { Scene } from "./Scene";

export
class MapScene
extends Scene {

    readonly Scene = true;

    private readonly mapPath = 'static/gltf/map/map2.gltf';
    private readonly playerPath = 'static/gltf/soldier/soldier.gltf';
    private readonly gltfLoader = new GLTFLoader();
    private model: three.Group;
    // private soldier: three.Object3D;

    constructor() {
        super(new three.Group(), 'Map scene', { });
    }

    async initialize(): Promise<boolean> {
        return this.model ?
            Promise.resolve(true) :
            new Promise<boolean>((resolve, reject) => {
                this.gltfLoader.load(
                    this.mapPath,
                    (mapGltf: GLTF) => {
                        this.model = mapGltf.scene;
                        this.model.castShadow = true;
                        this.model.traverse(obj => { if ((obj as any).isMesh) obj.castShadow = true; });
                        this.model.position.set(-30, 0, -30);
                        this.node.add(this.model);
                        this.foldersMap.forEach((_, gui) => this.register(gui));
                        resolve(true);
                    },
                    () => { },
                    (errorEvent) => reject(errorEvent),
                );
            });
    }

    register(gui: GUI): void {
        const folder = this.getFolder(gui, true);
        if (this.model) {
            registerThreeObjectDefaul(folder, this.model, defaultDebugConfings);
        }
    }
    
}