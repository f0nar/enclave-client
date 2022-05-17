import GUI, { Controller } from 'lil-gui';
import * as three from 'three';
import { Vector3 } from 'three';
import { IDebuggable } from './IDebuggable';
import { ThreeGraphic } from './ThreeGraphic';

type VectorT = three.Vector2 | three.Vector3 | three.Vector4;
export const registerThreeVector = (gui: GUI, vector: VectorT, title: string, updateCb?: (newValue: number) => void) => {
    const folder = gui.addFolder(title);
    const controllers = 
        ['x', 'y', 'z', 'w']
        .filter(property => property in vector)
        .map(property => folder.add(vector, property));
    if (updateCb) {
        controllers.forEach((controller) => controller.onChange(updateCb));
    }

    return folder;
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
        protected debug: {
            position?: boolean,
            scale?: boolean,
            rotate?: boolean,
        } = {
            position: true,
            scale: true,
            rotate: true,
        },
    ) {
        super(node);
    }

    register(gui: GUI): void {
        if (!this.debug) { return; }

        const folder = this.getFolder(gui, true);

        if (this.debug.position) {
            registerThreeVector(folder, this.node.position, 'position');
        }
        if (this.debug.scale) {
            registerThreeVector(folder, this.node.scale, 'scale');
        }
        if (this.debug.rotate) {
            const node = this.node;
            const rotateVector = new Vector3(...node.rotation.toArray());
            registerThreeVector(folder, rotateVector, 'rotation', (newValue: number) => this.node.rotation.setFromVector3(rotateVector));
        }
    }

    unregister(gui: GUI): void {
        if (!this.debug) { return; }
        this.getFolder(gui, false)?.destroy();
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