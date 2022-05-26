
import * as three from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { spine } from '../../spine-threejs/spine-threejs';
import { MapScene } from './MapScene';
import { Scene } from './Scene';
import { SimpleSceneNavigator } from './SceneNavigator';

const createDiv = () => document.createElement('div') as HTMLDivElement

const createTextDiv = (text: string) => {
    const textDiv = createDiv();
    textDiv.className = 'main-scene-button-text';
    textDiv.textContent = text;
    return textDiv;
};

const createButtonDiv = (...children: Array<HTMLElement>) => {
    const buttonDiv = createDiv();
    buttonDiv.className = 'main-scene-button';
    buttonDiv.style.backgroundColor = `rgba(${60},${179},${113},${0.7})`;
    children.forEach(child => buttonDiv.appendChild(child));
    return buttonDiv;
};

export
class MainScene
extends Scene {

    private readonly spinePath = 'static/spine/main_screen_alpha/';
    private readonly jsonName = 'Main_Screen.json';
    private readonly atlasName = 'Main_Screen.atlas';
    private readonly spineLoader = new AsyncSpineLoader(new spine.threejs.AssetManager(this.spinePath));
    private gameButton: CSS3DObject;
    private playerButton: CSS3DObject;
    private skeletomMesh: spine.threejs.SkeletonMesh;

    // TODO: make SceneNavigator static for all scenes
    // TODO: Consider way if scene should add itself to navigator by itself
    constructor(
        private readonly navigator: SimpleSceneNavigator
    ) {
        super(new three.Group(), 'Main scene');
        this.navigator.addScene('map', new MapScene());
    }

    update(dt: number) {
        this.skeletomMesh?.update(dt);
    }
    
    async initialize(): Promise<boolean> {
        await this.spineLoader.load(this.jsonName, this.atlasName);
        const atlas = this.spineLoader.defaultLoader.get(this.atlasName);
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        const skeletonJson = new spine.SkeletonJson(atlasLoader);
        skeletonJson.scale = 0.4;
        const skeletonData = skeletonJson.readSkeletonData(this.spineLoader.defaultLoader.get(this.jsonName));
        this.skeletomMesh = new spine.threejs.SkeletonMesh(skeletonData, (params) => params.depthTest = false);
        this.skeletomMesh.state.setAnimation(0, 'animation', true);
        this.skeletomMesh.position.z = -540;
        this.node.add(this.skeletomMesh);

        const startGameButtonDiv = createButtonDiv(createTextDiv('Game'));
        startGameButtonDiv.onclick = (ev: MouseEvent) => this.navigator.display("map");

        this.gameButton = new CSS3DObject(startGameButtonDiv);
        this.gameButton.position.set(0, 30, this.skeletomMesh.position.z); // TODO: make location and size adaptive
        startGameButtonDiv.style.pointerEvents = 'none' // TODO: find better way to disable button or create style for that

        const buttonDiv = createButtonDiv(createTextDiv('Create Player'))
        buttonDiv.onclick = (ev: MouseEvent) => startGameButtonDiv.style.pointerEvents = 'auto';

        this.playerButton = new CSS3DObject(buttonDiv);
        this.playerButton.position.set(0, -30, this.skeletomMesh.position.z);

        this.node.add(this.gameButton, this.playerButton);
        
        return Promise.resolve(true);
    }

    async destroy(): Promise<boolean> {
        this.node.remove(this.gameButton, this.playerButton, this.skeletomMesh);
        
        return Promise.resolve(true);
    }
    
}

class AsyncSpineLoader {

    constructor(
        public readonly defaultLoader: spine.threejs.AssetManager,
    ) { }

    load(jsonPath: string, atlasPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const onError = (path: string, error: string) => reject({ path, error });
            const onAtlasLoadingSuccess = () => !this.defaultLoader.isLoadingComplete() ? requestAnimationFrame(onAtlasLoadingSuccess) : resolve();
            const onTextLoadingSuccess = () => this.defaultLoader.loadTextureAtlas(atlasPath, onAtlasLoadingSuccess, onError);
            this.defaultLoader.loadText(jsonPath, onTextLoadingSuccess, onError);
        })
    }

}
