import GUI from 'lil-gui';

export interface IDebuggable {

    readonly IDebuggable: true;
    register(gui: GUI): void;
    unregister(gui: GUI): void;

}
