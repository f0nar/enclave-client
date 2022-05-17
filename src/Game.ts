import * as three from 'three';
import GUI from 'lil-gui';
import { View } from './graphics/View';
import { Canvas } from './graphics/Canvas';
import { World } from './graphics/World';
import { ThreeDebuggableGraphic } from './graphics/ThreeDebuggable';

const sphere = new class extends ThreeDebuggableGraphic<three.Mesh> {
    constructor() {
        super(
            new three.Mesh(new three.SphereGeometry(10),new three.MeshBasicMaterial({ color: 0xff0000 })),
            'Sphere'
        )
    }
}

export
class Game {

    protected readonly clock = new three.Clock();
    protected readonly gui = new GUI();

    protected readonly view: View;
    protected readonly canvas: Canvas;
    protected readonly world: World;

    constructor(
        canvasParent = document.body,
    ) {
        this.canvas = new Canvas(canvasParent);
        this.world = new World();
        this.view = new View(this.canvas);
        this.view.getNode().position.set(0, 10, 50);
        this.view.getNode().lookAt(this.world.getNode().position);
        this.world.add(this.view, sphere);

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
