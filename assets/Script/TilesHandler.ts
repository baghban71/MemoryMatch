import { _decorator, CCInteger, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import { Tile } from './Tile';
import { ObjectPool } from './ObjectPool';
import { TilesPosition } from './TilesPosition';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('TilesHandler')
export class TilesHandler extends Component {

    @property(Node)
    canvasNode: Node = null;

    @property(Prefab)
    tilePrefab: Prefab = null;

    tiles: Node[] = [];

    @property(SpriteFrame)
    spriteFrames: SpriteFrame[] = [];

    @property(CCInteger)
    tileCount: number = 0;

    // 4,9,16,25
    // 6,8,10,12,14,16,18,20,22,24,26,28,30
    selectedTiles: Tile[] = [null, null];
    selctedIndex = -1;

    canCheck: boolean = false;

    Reset() {
        let idCounter = 0;


        this.tiles.forEach(element => {
            element.active = false;
        });


        this.tiles = [];

        this.canCheck = false;
        this.selectedTiles = [null, null];
        Events.eventTarget.emit('Tile:canSelect', false);

        for (var i = 0; i < this.tileCount; i++) {

            let a = ObjectPool.getInstance().GetPooledObject(this.canvasNode, 0);
            let tileComp = a.getComponent(Tile);

            //a.setScale(0.001, 0.001, 1);

            tileComp.id = idCounter++;

            let tileScript = a.getComponent(Tile);
            tileScript.spriteIndex = this.getRandomInt(this.spriteFrames.length);
            tileScript.centerSprite.spriteFrame = this.spriteFrames[tileScript.spriteIndex];

           // tileScript.show();

            this.tiles.push(a);
        };

        //console.log(this.tiles.length);
        this.node.getComponent(TilesPosition).setPos();

        setTimeout(() => {
            this.ToFace(true);
        }, 500);
        setTimeout(() => {
            this.ToFace(false);
            this.canCheck = true;
            Events.eventTarget.emit('Tile:canSelect', true);
        }, 2000);

    }

    ToFace(toFace: Boolean) {
        this.tiles.forEach(element => {
            let tileScript = element.getComponent(Tile);
            if (tileScript.isBack == toFace) {
                tileScript.turn();
            }
        });
    }

    protected onLoad(): void {
        Events.eventTarget.on('reset', () => {
            this.Reset();
        });
    }
    start() {
        this.tiles = [];
        let scaleFactor = 0.5;





        Events.eventTarget.on('allToFace', (toFace: boolean) => {
            this.ToFace(toFace);

            this.selectedTiles[0] = null;
            this.selectedTiles[1] = null;
            this.canCheck = !toFace;
        });

        Events.eventTarget.on('turn', (tile: Tile) => {
            if (!this.canCheck)
                return;
            if (!tile.isBack && this.selectedTiles[0] == null) {
                this.selectedTiles[0] = tile;
            } else if (!tile.isBack && this.selectedTiles[1] == null) {
                this.selectedTiles[1] = tile;
                Events.eventTarget.emit('Tile:canSelect', false);
                setTimeout(() => {
                    // dont change this cods order
                    Events.eventTarget.emit('Tile:canSelect', true);
                    this.checkCorrection();

                    this.selectedTiles[0] = null;
                    this.selectedTiles[1] = null;
                }, 1000);
                //console.log("Hello Turn!", this.selectedTiles[0], this.selectedTiles[1], tile.isBack, tile.id, tile.spriteIndex);
               // console.log(this.selectedTiles[0].spriteIndex, this.selectedTiles[1].spriteIndex);
            }
        }, this);

        // return ball.getComponent('Ball');
    }

    checkCorrection() {
        let isCorrect = this.selectedTiles[0].spriteIndex == this.selectedTiles[1].spriteIndex;
        if (this.selectedTiles[0] != null && this.selectedTiles[1] != null) {
            Events.eventTarget.emit("isCorrect", isCorrect, this.selectedTiles[0], this.selectedTiles[1]);

            if (isCorrect) {
                this.selectedTiles[0].hide();
                this.selectedTiles[1].hide();

            } else {
                this.selectedTiles[0].turn();
                this.selectedTiles[1].turn();
            }


        }

    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    // update(deltaTime: number) {

    // }
}