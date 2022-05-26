import GUI from 'lil-gui';
import * as three from 'three';
import { defaultDebugConfings, registerThreeObjectDefaul, ThreeDebuggableGraphic } from "./ThreeDebuggable";

export
class LightSet
extends ThreeDebuggableGraphic<three.Group> {

    private dirLight = new three.DirectionalLight();
    private pointLight = new three.PointLight();
    private helpers = [new three.DirectionalLightHelper(this.dirLight), new three.PointLightHelper(this.pointLight)];

    constructor() {
        super(new three.Group(), 'Light set', { });
        this.dirLight.position.set(-20, 20, -20);
        this.pointLight.position.set(0, 20, -20);
        this.node.add(this.dirLight, this.dirLight.target, this.pointLight, ...this.helpers);
    }

    register(gui: GUI): void {
        const folder = this.getFolder(gui, true);
        registerThreeObjectDefaul(folder.addFolder('Directional light'), this.dirLight, defaultDebugConfings);
        registerThreeObjectDefaul(folder.addFolder('Point light'), this.pointLight, defaultDebugConfings);
    }

}