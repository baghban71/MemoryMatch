import { _decorator, Component, Node } from 'cc';
import { TilesHandler } from './TilesHandler';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('TilesPosition')
export class TilesPosition extends Component {

    tilesHandler: TilesHandler = null;

    protected onLoad(): void {
        this.tilesHandler = this.node.getComponent(TilesHandler);
    }

    start() {

    }

    setPos(columns, rows, tileDemision) {
        let scaleFactor = 0.5;
        let index = 0;
        var xDiff = ((columns - 1) * tileDemision) / 2;
        var yDiff = ((rows - 1) * tileDemision) / 2;
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {
                let a = this.tilesHandler.tiles[index];
                this.tilesHandler.tiles[index].active = true;
                index++;
                a.setPosition((i * tileDemision) - xDiff, (j * tileDemision) - yDiff, 0);
                a.setScale(scaleFactor, scaleFactor, 1);
                a.getComponent(Tile).scaleFactor = scaleFactor;
            }
        }

    }

    // update(deltaTime: number) {
    // }
}


