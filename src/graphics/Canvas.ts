import * as three from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { View } from './View';
import { World } from './World';

export
interface Rect {
    width: number,
    height: number,
}

export
interface ICanvasResizeListener {

    resize(rect: Rect): void;

}

export 
class Canvas {

    protected readonly glRenderer: three.WebGLRenderer;
    protected readonly cssRenderer: CSS3DRenderer;
    protected readonly resizeObserver: ResizeObserver;
    protected readonly resizeListeners = new Set<ICanvasResizeListener>();

    constructor(private canvasParent: HTMLElement = document.body) {
        this.glRenderer = new three.WebGLRenderer({ alpha: true });
        this.glRenderer.setClearColor(0x000000);
        this.glRenderer.setSize(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
        this.canvasParent.appendChild(this.glRenderer.domElement);

        this.cssRenderer = new CSS3DRenderer();
        this.cssRenderer.setSize(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.position = 'absolute';
        this.canvasParent.appendChild(this.cssRenderer.domElement);

        this.resizeObserver = new ResizeObserver((entries) => this.setSize(entries[0].contentRect));
        this.resizeObserver.observe(this.canvasParent);
    }

    render(view: View, world: World) {
        this.glRenderer.render(world.getNode(), view.getNode());
        this.cssRenderer.render(world.getNode(), view.getNode());
    }

    setSize(rect: Rect): void {
        this.glRenderer.setSize(rect.width, rect.height);
        this.cssRenderer.setSize(rect.width, rect.height);
        this.resizeListeners.forEach((listener) => listener.resize(rect));
    }

    getSize(): Rect {
        return {
            width: this.glRenderer.domElement.clientWidth,
            height: this.glRenderer.domElement.clientHeight,
        }
    }

    addListener(listener: ICanvasResizeListener): void {
        this.resizeListeners.add(listener);
    }

    removeListener(listener: ICanvasResizeListener): boolean {
        return this.resizeListeners.delete(listener);
    }

}