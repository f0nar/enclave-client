
import * as three from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { spine } from '../../spine-threejs/spine-threejs';
import { Scene, SceneNavigator } from './Scene';

export class MainScene implements Scene {

    readonly Scene = true;

    private readonly spinePath = 'static/spine/main_screen_alpha/';
    private readonly jsonName = 'Main_Screen.json';
    private readonly atlasName = 'Main_Screen.atlas';
    private readonly spineLoader = new spine.threejs.AssetManager(this.spinePath);
    private loadState: 'none' | 'started' | 'done' = 'none';
    private gameButton: CSS3DObject;

    private skeletomMesh: spine.threejs.SkeletonMesh | null = null;

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

            const textDiv = document.createElement('div') as HTMLDivElement;
            textDiv.className = 'main-scene-button-text';
            textDiv.textContent = 'Game';

            const buttonDiv = document.createElement('div') as HTMLDivElement;
            buttonDiv.className = 'main-scene-button';
            buttonDiv.style.backgroundColor = `rgba(${60},${179},${113},${0.7})`;
            buttonDiv.onclick = (ev: MouseEvent) => {
                this.navigator.display("map");
                this.navigator.close("main");
            }
            buttonDiv.appendChild(textDiv);

            this.gameButton = new CSS3DObject(buttonDiv);
            this.gameButton.position.z = -500;

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
            world.add(this.skeletomMesh, this.gameButton);
        }
    }

    clear(world: three.Scene): void {
        if (this.skeletomMesh) {
            world.remove(this.skeletomMesh, this.gameButton);
        }
    }

    update(dt: number) {
        this.skeletomMesh?.update(dt);
    }
    
}