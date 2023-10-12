import { _decorator, CCInteger, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import { Tile } from './Tile';
import { ObjectPool } from './ObjectPool';
import { TilesPosition } from './TilesPosition';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('TilesHandler')
export class TilesHandler extends Component {


    @property(Node)
    topLeft: Node = null;

    @property(Node)
    downRights: Node = null;

    @property(Node)
    canvasNode: Node = null;

    @property(Node)
    tilesHolder: Node = null;

    @property(Prefab)
    tilePrefab: Prefab = null;

    tiles: Node[] = [];

    @property(SpriteFrame)
    spriteFrames: SpriteFrame[] = [];

    @property(CCInteger)
    columns: number = 0;

    @property(CCInteger)
    rows: number = 0;

    // 4,9,16,25
    // 6,8,10,12,14,16,18,20,22,24,26,28,30
    selectedTiles: Tile[] = [null, null];
    selctedIndex = -1;

    canCheck: boolean = false;

    canChangePos: boolean = false;

    tileDemision: number = 100;
    disanceFromLeft: number = 75;

    Reset() {
        let idCounter = 0;
        let MAX_TILE_COUNT = this.columns * this.rows;

        this.tiles.forEach(element => {
            element.active = false;
        });


        this.tiles = [];

        this.canCheck = false;
        this.selectedTiles = [null, null];
        Events.eventTarget.emit('Tile:canSelect', false);

        for (var i = 0; i < MAX_TILE_COUNT; i++) {

            let a = ObjectPool.getInstance().GetPooledObject(this.tilesHolder, 0);
            //this.tilesHolder.addChild(a);
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
        this.node.getComponent(TilesPosition).setPos(this.columns, this.rows, this.tileDemision);
        //this.canChangePos = true;
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
    update(deltaTime: number) {
        // if (!this.canChangePos)
        //   return;
        var tlPos = this.topLeft.getPosition();
        var drPos = this.downRights.getPosition();
        var width = Math.abs(tlPos.x) + Math.abs(drPos.x);
        var height = Math.abs(tlPos.y) + Math.abs(drPos.y);
        var widthMid = (tlPos.x + drPos.x);
        var heightMid = (drPos.y + tlPos.y);
        var totalTilesWidth = this.columns * (this.tileDemision + 12.5);//4x = 450;
        var totalTilesHeight = this.rows * (this.tileDemision + 12.5);//4x =450;
        var xScaleFactor = width / totalTilesWidth;
        var yScaleFactor = height / totalTilesHeight;


        this.tilesHolder.setPosition(widthMid + this.disanceFromLeft, heightMid, 0);

        if (xScaleFactor < yScaleFactor)
            this.tilesHolder.setWorldScale(xScaleFactor, xScaleFactor, 1);
        else
            this.tilesHolder.setWorldScale(yScaleFactor, yScaleFactor, 1);
    }
}