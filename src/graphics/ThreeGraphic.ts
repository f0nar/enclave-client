import GUI from 'lil-gui';
import * as three from 'three';
import { IDebuggable } from './IDebuggable';
import { IGraphic } from './IGraphic';

export
abstract class ThreeGraphic<NodeT extends three.Object3D = three.Object3D>
implements IGraphic<NodeT> {

    readonly IGraphic = true;

    constructor(protected node: NodeT) { }

    update(dt: number): void { }

    getNode(): NodeT { return this.node; }

}

export
abstract class ThreeDebuggableGraphic<NodeT extends three.Object3D = three.Object3D>
extends ThreeGraphic<NodeT>
implements IDebuggable {

    readonly IDebuggable = true;

    register(gui: GUI): void { }

    unregister(gui: GUI): void { }

}
