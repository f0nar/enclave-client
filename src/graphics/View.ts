import GUI from 'lil-gui';
import { Vector2 } from 'spine-ts-threejs';
import * as three from 'three';
import { Canvas, ICanvasResizeListener, Rect } from './Canvas';
import { registerThreeVector, ThreeDebuggableGraphic } from './ThreeDebuggable';

const aspect = (rect: Rect) =>  rect.width / rect.height;

export
class View
extends ThreeDebuggableGraphic<three.PerspectiveCamera>
implements ICanvasResizeListener {

    constructor(
        protected canvas: Canvas,
        protected target = new three.Vector3(),
    ) {
        super(new three.PerspectiveCamera(45, aspect(canvas.getSize()), 0.1, 1000), 'Camera', { });
        this.node.lookAt(this.target);
        this.canvas.addListener(this);
    }

    resize(rect: Rect): void {
        this.node.aspect = aspect(rect);
        this.node.updateProjectionMatrix();
    }

    register(gui: GUI): void {
        const folder = this.getFolder(gui, true);
        const target = new three.Vector3(0, 0, -1).applyQuaternion(this.node.quaternion).add(this.node.position);
        const updateCamera = () => {
            this.node.lookAt(target);
            this.node.updateProjectionMatrix();
        };
        registerThreeVector(folder, this.node.position, 'position', updateCamera);
        registerThreeVector(folder, target, 'target', updateCamera);
    }

}