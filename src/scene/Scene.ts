import * as three from 'three';
import { ThreeDebuggableGraphic } from '../graphics/ThreeDebuggable';


export
abstract class Scene
extends ThreeDebuggableGraphic<three.Group> {

    readonly Scene = true;

    abstract initialize(): Promise<boolean>;

    destroy(): Promise<boolean> {
        return Promise.resolve(true);
    }

}
