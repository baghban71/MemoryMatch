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

    setPos() {
        let scaleFactor = 0.5;
        let index = 0;
 
        for (var i = 0; i < Math.pow(this.tilesHandler.tileCount, 0.5); i++) {
            for (var j = 0; j < Math.pow(this.tilesHandler.tileCount, 0.5); j++) {
                let a = this.tilesHandler.tiles[index];
                index++;
                a.setPosition(i * 100, j * 100, 0);
                a.setScale(scaleFactor, scaleFactor, 1);
                a.getComponent(Tile).scaleFactor = scaleFactor;
            }
        }
    }


    // update(deltaTime: number) {
    // }
}


