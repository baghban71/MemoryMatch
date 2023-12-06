import { _decorator, Component, Input, Node, tween, Vec3 } from 'cc';
import { TilesHandler } from './TilesHandler';
import { Events } from './Events';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('HelpManager')
export class HelpManager extends Component {
    @property(Node)
    hand: Node = null;
    @property(Node)
    help_btn: Node = null;
    @property(Node)
    tilesHandlerNode: Node = null;

    tilesHandler: TilesHandler = null;


    avilablesTiles: Node[];


    nodeMustSelect: Node = null;
    selectNode: Node = null;

    start() {



        let tw = tween(this.hand)
            .to(0.5, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.5, { scale: new Vec3(1, 1, 1) })

        tween(this.hand)
            .repeatForever(tw)  // Repeat the 'embedTween'
            .start()

        this.tilesHandler = this.tilesHandlerNode.getComponent(TilesHandler);

        Events.eventTarget.on('play', (index) => {

        });

        Events.eventTarget.on('onBackBtnClick', () => {
            this.hand.active = false;
            this.selectNode = null;
            
        });


        Events.eventTarget.on('TilesHandler:isCorrect', (isCorrect: boolean) => {
            let activeTiles = this.getActiveTiles();
            if (isCorrect && activeTiles.length <= 4) {
                this.help_btn.active = false;
            }
            if (activeTiles.length > 4)
                this.help_btn.active = true;





            this.selectNode = null;

        });


        Events.eventTarget.on('Tile:onTouch', (sender: Tile) => {
            this.selectNode = sender.node;
            if (this.nodeMustSelect == sender.node) {
                this.getNextHelpPos(sender.spriteIndex);
            } else {
                this.hand.active = false;

                let activeTiles = this.getActiveTiles();
                if (activeTiles.length > 2) {
                    this.help_btn.active = true;
                }

            }



        });


        this.help_btn.on(Input.EventType.TOUCH_START, () => {
            this.hand.active = true;
            this.avilablesTiles = this.getActiveTiles();

            if (this.selectNode != null) {
                this.getNextHelpPos(this.selectNode.getComponent(Tile).spriteIndex);
            } else {
                this.selectNode = null;

                this.shuffle(this.avilablesTiles);
                this.hand.setWorldPosition(this.avilablesTiles[0].getWorldPosition());
                this.nodeMustSelect = this.avilablesTiles[0];
                // this.nodeMustSelect.setRotationFromEuler(0, 0, 45);
                this.help_btn.active = false;
            }
        }, this);

    }
    getNextHelpPos(firstIndex) {
        for (var i = 0; i < this.avilablesTiles.length; i++) {
            if (this.avilablesTiles[i].getComponent(Tile).spriteIndex == firstIndex && this.avilablesTiles[i] != this.selectNode) {
                this.hand.setWorldPosition(this.avilablesTiles[i].getWorldPosition());
            }
        }
    }


    getActiveTiles() {
        let activeTiles = [];
        this.tilesHandler.tiles.forEach(element => {
            if (element.active)
                activeTiles.push(element);

        });
        return activeTiles;
    }





    shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    }
}