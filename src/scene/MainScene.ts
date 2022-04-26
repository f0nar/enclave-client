
import * as three from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { spine } from '../../spine-threejs/spine-threejs';
import { Scene, SceneNavigator } from './Scene';

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

export class MainScene implements Scene {

    readonly Scene = true;

    private readonly spinePath = 'static/spine/main_screen_alpha/';
    private readonly jsonName = 'Main_Screen.json';
    private readonly atlasName = 'Main_Screen.atlas';
    private readonly spineLoader = new spine.threejs.AssetManager(this.spinePath);
    private loadState: 'none' | 'started' | 'done' = 'none';
    private gameButton: CSS3DObject;
    private playerButton: CSS3DObject;

    private skeletomMesh: spine.threejs.SkeletonMesh | null = null;

    // TODO: make SceneNavigator static for all scenes
    // TODO: Consider way if scene should add itself to navigator by itself
    constructor(private readonly navigator: SceneNavigator) {}

    load(world: three.Scene): void {
        const loopCb = () => this.load(world);
        if (
            !this.skeletomMesh
            && this.loadState === 'none'
        ) {
            this.spineLoader.loadText(this.jsonName);
            this.spineLoader.loadTextureAtlas(this.atlasName);
            this.loadState = 'started';

            const startGameButtonDiv = createButtonDiv(createTextDiv('Game'));
            startGameButtonDiv.onclick = (ev: MouseEvent) => {
                // TODO: add api to switch scene
                this.navigator.display("map");
                this.navigator.close("main");
            }

            this.gameButton = new CSS3DObject(startGameButtonDiv);
            this.gameButton.position.set(0, 30, -500); // TODO: make location and size adaptive
            startGameButtonDiv.style.pointerEvents = 'none' // TODO: find better way to disable button or create style for that

            const buttonDiv = createButtonDiv(createTextDiv('Create Player'))
            buttonDiv.onclick = (ev: MouseEvent) => startGameButtonDiv.style.pointerEvents = 'auto';

            this.playerButton = new CSS3DObject(buttonDiv);
            this.playerButton.position.set(0, -30, -500);

            requestAnimationFrame(loopCb);
        } else if (
            !this.skeletomMesh
            && this.loadState === 'started'
            && !this.spineLoader.isLoadingComplete()
        ) {
            requestAnimationFrame(loopCb);
        } else {
            const atlas = this.spineLoader.get(this.atlasName);
            const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
            const skeletonJson = new spine.SkeletonJson(atlasLoader);
            skeletonJson.scale = 0.4;
            const skeletonData = skeletonJson.readSkeletonData(this.spineLoader.get(this.jsonName));
            this.skeletomMesh = new spine.threejs.SkeletonMesh(
                skeletonData,
                (params) => params.depthTest = false,
            );
            this.skeletomMesh.state.setAnimation(0, 'animation', true);
            this.skeletomMesh.position.z = -500;
            world.add(this.skeletomMesh, this.gameButton, this.playerButton);
        }
    }

    clear(world: three.Scene): void {
        if (this.skeletomMesh) {
            world.remove(this.skeletomMesh, this.gameButton, this.playerButton);
        }
    }

    update(dt: number) {
        this.skeletomMesh?.update(dt);
    }
    
}