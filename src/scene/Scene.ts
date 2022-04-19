import * as three from 'three';

export interface Scene {

    readonly Scene: boolean;

    // TODO: use promise as return type
    load(worldScene: three.Scene): void;

    clear(worldScene: three.Scene): void;

    update(dt: number): void;

}

export interface SceneNavigator {

    readonly SceneNavigator: boolean;

    display(sceneName: string): void;

    close(sceneName: string): void;

}