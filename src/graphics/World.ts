import * as three from 'three';
import { ThreeDebuggableGraphic, ThreeGraphic } from './ThreeGraphic';

export
class World
extends ThreeDebuggableGraphic<three.Scene> {

    protected readonly mainGroup = new three.Group();
    protected readonly children = new Set<ThreeGraphic>();
    protected readonly axesHelper = new three.AxesHelper(1000);

    constructor() {
        super(new three.Scene());
        this.mainGroup.add(this.axesHelper);
        this.node.add(this.mainGroup);
    }

    add(...children: Array<ThreeGraphic>): void {
        for (const child of children) {
            this.children.add(child);
            this.mainGroup.add(child.getNode());
        }
    }

    remove(...children: Array<ThreeGraphic>): void {
        for (const child of children) {
            this.children.delete(child);
            this.mainGroup.remove(child.getNode());
        }
    }

    update(dt: number): void {
        this.children.forEach(child => child.update(dt));
    }

    clear(): void {
        this.remove(...Array.from(this.children));
        this.children.clear();
    }

}
