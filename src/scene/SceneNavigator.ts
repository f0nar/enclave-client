import { World } from '../graphics/World';
import { Scene } from "./Scene";

export
interface ISceneLoadingBroadcaster {

    start(): void;

    finish(): void;

}

export
class SimpleSceneNavigator {

    readonly SceneNavigator = true;

    private active: Scene | undefined;
    private readonly scenes = new Map<string, Scene>();

    constructor(
        private readonly world: World,
        private readonly brodcaster: ISceneLoadingBroadcaster,
        ...scenes: Array<[string, Scene]>
    ) {
        scenes.forEach(([path, scene]) => this.addScene(path, scene));
    }

    addScene(path: string, scene: Scene) {
        this.scenes.set(path, scene);
    }

    async display(path: string): Promise<void> {
        this.brodcaster.start();

        if (this.active) {
            await this.active.destroy();
            this.world.remove(this.active);
            this.active = undefined;
        }

        const sceneToLoad = this.scenes.get(path);
        if (sceneToLoad) {
            this.world.add(sceneToLoad);
            await sceneToLoad.initialize();
            this.active = sceneToLoad;
        }

        this.brodcaster.finish();

        return Promise.resolve();
    }

    getActive() {
        return this.active;
    }
    
}