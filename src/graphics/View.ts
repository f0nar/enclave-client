import * as three from 'three';
import { Canvas, ICanvasResizeListener, Rect } from './Canvas';
import { ThreeDebuggableGraphic } from './ThreeGraphic';

const aspect = (rect: Rect) =>  rect.width / rect.height;

export
class View
extends ThreeDebuggableGraphic<three.PerspectiveCamera>
implements ICanvasResizeListener {

    constructor(
        protected canvas: Canvas,
    ) {
        super(new three.PerspectiveCamera(45, aspect(canvas.getSize()), 0.1, 1000));
        this.canvas.addListener(this);
    }

    resize(rect: Rect): void {
        this.node.aspect = aspect(rect);
        this.node.updateProjectionMatrix();
    }

}