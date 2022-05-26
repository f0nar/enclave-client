import GUI, { Controller } from 'lil-gui';
import * as three from 'three';
import { Group, Vector3 } from 'three';
import { IDebuggable } from './IDebuggable';
import { ThreeGraphic } from './ThreeGraphic';

type VectorT = {
    x: number,
    y: number,
    z?: number,
    w?: number
};

export const registerThreeVector = (gui: GUI, vector: VectorT, title: string, updateCb?: (newValue: number) => void) => {
    const folder = gui.addFolder(title).close();
    const controllers = 
        ['x', 'y', 'z', 'w']
        .filter(property => property in vector)
        .map(property => folder.add(vector, property).listen());
    if (updateCb) {
        controllers.forEach((controller) => controller.onChange(updateCb));
    }

    return folder;
}

type Partial<T> = {
    [P in keyof T]?: T[P];
}

export
const defaultDebugConfings = {
    position: true,
    scale: true,
    rotate: true,
};

type DefaultDebugConfings = Partial<typeof defaultDebugConfings>;

export
const registerThreeObjectDefaul = (folder: GUI, object: three.Object3D, debug: DefaultDebugConfings) => {
    if (debug.position) {
        registerThreeVector(folder, object.position, 'position');
    }
    if (debug.scale) {
        registerThreeVector(folder, object.scale, 'scale');
    }
    if (debug.rotate) {
        const rotateVector = new Vector3(...object.rotation.toArray());
        registerThreeVector(folder, rotateVector, 'rotation', () => object.rotation.setFromVector3(rotateVector));
    }
}

export
abstract class ThreeDebuggableGraphic<NodeT extends three.Object3D = three.Object3D>
extends ThreeGraphic<NodeT>
implements IDebuggable {

    readonly IDebuggable = true;
    protected readonly foldersMap = new Map<GUI, GUI>();

    constructor(
        node: NodeT,
        private title: string,
        protected debug: DefaultDebugConfings = defaultDebugConfings,
    ) {
        super(node);
    }

    register(gui: GUI): void {
        // TODO: revisit configs model 
        registerThreeObjectDefaul(this.getFolder(gui, true), this.node, this.debug);
    }

    unregister(gui: GUI): void {
        const folder = this.getFolder(gui, false);
        if (folder) {
            this.foldersMap.delete(gui);
            folder.destroy();
        }
    }

    protected getFolder(gui: GUI, createIfNotExist: true): GUI;
    protected getFolder(gui: GUI, createIfNotExist: false): GUI | undefined;
    protected getFolder(gui: GUI, createIfNotExist = true): GUI | undefined {
        if (createIfNotExist && !this.foldersMap.has(gui)) {
            this.foldersMap.set(gui, gui.addFolder(this.title));
        }
        return this.foldersMap.get(gui)!;
    }

}
