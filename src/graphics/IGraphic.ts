export interface IGraphic<NodeT> {

    readonly IGraphic: true;
    update(dt: number): void;
    getNode(): NodeT;

}
