import * as three from 'three';
import GUI from 'lil-gui';
import { View } from './graphics/View';
import { Canvas } from './graphics/Canvas';
import { World } from './graphics/World';
import { ThreeDebuggableGraphic } from './graphics/ThreeDebuggable';
import { SimpleSceneNavigator } from './scene/SceneNavigator';
import { MainScene } from './scene/MainScene';
import { LightSet } from './graphics/LightSet';

const broacaster = {
    start() { console.log('broacaster start'); },
    finish() { console.log('broacaster start'); },
};

export
class Game {

    protected readonly clock = new three.Clock();
    protected readonly gui = new GUI().close();

    protected readonly view: View;
    protected readonly canvas: Canvas;
    protected readonly world: World;
    protected readonly sceneNavigator: SimpleSceneNavigator;

    constructor(
        canvasParent = document.body,
    ) {
        this.canvas = new Canvas(canvasParent);
        this.world = new World();
        this.view = new View(this.canvas);
        this.view.getNode().position.set(0, 10, 50);
        this.view.getNode().lookAt(this.world.getNode().position);
        this.world.add(this.view, new LightSet());
        this.sceneNavigator = new SimpleSceneNavigator(this.world, broacaster);
        this.sceneNavigator.addScene('main', new MainScene(this.sceneNavigator));
        this.sceneNavigator.display('main');

        this.world.register(this.gui);

        this.mainLoop = this.mainLoop.bind(this);
        this.mainLoop();
    }

    protected mainLoop() {
        this.world.update(this.clock.getDelta());
        this.canvas.render(this.view, this.world);
        requestAnimationFrame(this.mainLoop);
    }

}
