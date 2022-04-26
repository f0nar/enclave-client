import * as three from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { MainScene } from './scene/MainScene';
import { MapScene } from './scene/MapScene';
import { SimpleSceneNavigator } from './scene/SceneNavigator';

// TODO : split scene and render dependent parts (world, view)
export class Game {

    private readonly glRenderer: three.WebGLRenderer;
    private readonly cssRenderer: CSS3DRenderer;
    private readonly camera: three.PerspectiveCamera;
    private readonly scene: three.Scene;
    private readonly clock = new three.Clock();
    private readonly resizeObserver: ResizeObserver;
    private readonly sceneNavigator: SimpleSceneNavigator;
    private readonly dirLight = new three.DirectionalLight(0xffffff);

    constructor(
        private readonly canvasParent = document.body,
        public run = true
    ) {

        this.glRenderer = new three.WebGLRenderer({ alpha: true });
        this.glRenderer.setClearColor(0x00000);
        this.glRenderer.setSize(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
        this.canvasParent.appendChild(this.glRenderer.domElement);

        this.cssRenderer = new CSS3DRenderer();
        this.cssRenderer.setSize(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.position = 'absolute';
        this.canvasParent.appendChild(this.cssRenderer.domElement);

        this.scene = new three.Scene();

        const axis = new three.AxesHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);

        this.camera = new three.PerspectiveCamera(45, this.canvasParent.clientWidth / this.canvasParent.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(this.scene.position)

        this.resizeObserver = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            this.setSize(rect.width, rect.height);
        });
        this.resizeObserver.observe(this.canvasParent);

        this.sceneNavigator = new SimpleSceneNavigator(this.scene);
        this.sceneNavigator.addScenePath('main', new MainScene(this.sceneNavigator));
        this.sceneNavigator.display('main');
        
        this.sceneNavigator.addScenePath('map', new MapScene());
		this.dirLight.position.set(-30, 10, 500);
		this.dirLight.castShadow = true;
		this.dirLight.shadow.camera.top = 2;
		this.dirLight.shadow.camera.bottom = - 2;
		this.dirLight.shadow.camera.left = - 2;
		this.dirLight.shadow.camera.right = 2;
	    this.dirLight.shadow.camera.near = 0.1;
		this.dirLight.shadow.camera.far = 40;
        this.scene.add(this.dirLight);

        const loop = () => {
            if (this.run) {
                this.render();
            }
            requestAnimationFrame(loop);
        };

        loop();
    }

    private render() {
        // TODO: requires world to remove this part
        this.sceneNavigator.getActive().forEach(scene => scene.update(this.clock.getDelta()));
        this.glRenderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }

    private setSize(width: number, height: number) {
        this.glRenderer.setSize(width, height);
        this.cssRenderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

}