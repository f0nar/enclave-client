import { Scene, SceneNavigator } from "./Scene";
import * as three from 'three';

export class SimpleSceneNavigator implements SceneNavigator {

    readonly SceneNavigator = true;

    private readonly activeScenes = new Set<Scene>();
    private readonly scenePathes = new Map<string, Set<Scene>>();

    constructor(private readonly world: three.Scene) {}

    addScenePath(path: string, scene: Scene, ...restScenes: Scene[]) {
        const setToFill = this.scenePathes.get(path) || new Set<Scene>();
        [scene, ...restScenes].forEach(sceneToAdd => setToFill.add(sceneToAdd));
        if (!this.scenePathes.has(path)) {
            this.scenePathes.set(path, setToFill);
        }
    }

    display(path: string): void {
        this.scenePathes.get(path)?.forEach((scene) => {
            scene.load(this.world);
            this.activeScenes.add(scene);
        });
    }

    close(path: string): void {
        this.scenePathes.get(path)?.forEach((scene) => {
            scene.clear(this.world);
            this.activeScenes.delete(scene);
        });
    }

    getActive(): Array<Scene> {
        return Array.from(this.activeScenes);
    }
    
}