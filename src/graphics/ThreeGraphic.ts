import * as three from 'three';
import { IGraphic } from './IGraphic';

export
abstract class ThreeGraphic<NodeT extends three.Object3D = three.Object3D>
implements IGraphic<NodeT> {

    readonly IGraphic = true;

    constructor(protected node: NodeT) { }

    update(dt: number): void { }

    getNode(): NodeT { return this.node; }

}
