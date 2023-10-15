import { _decorator, Component, Event, Input, Label, Node, Sprite } from 'cc';
import { TilesHandler } from './TilesHandler';
import { Events } from './Events';
import { Tile } from './Tile';
import { ObjectPool } from './ObjectPool';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {


    @property(Node)
    mainMenu: Node = null;

    @property(Sprite)
    backBtnSprite: Sprite = null;

    @property(Sprite)
    helpBtnSprite: Sprite = null;

    @property(Sprite)
    resetBtnSprite: Sprite = null;

    @property(Sprite)
    playBtnSprite: Sprite = null;

    @property(Label)
    faceLableBtn: Label = null;

    @property(Label)
    backLableBtn: Label = null;

    canReset: boolean = true;



    tilesHandler: TilesHandler = null;


    protected onLoad(): void {

        this.tilesHandler = this.node.getComponent(TilesHandler);

        Events.eventTarget.on('reset', () => {
            this.restart();
        });
        Events.eventTarget.on('isCorrect', (isCorrect: boolean) => {

        });

        this.resetBtnSprite.node.on(Input.EventType.TOUCH_START, () => {
            if (!this.canReset)
                return;
            Events.eventTarget.emit('reset');
            this.canReset = false;
            setTimeout(() => {
                this.canReset = true;
            }, 2000);
        }, this);


        this.faceLableBtn.node.on(Input.EventType.TOUCH_START, () => {

            Events.eventTarget.emit('allToFace', true);
        }, this);

        this.backLableBtn.node.on(Input.EventType.TOUCH_START, () => {
            Events.eventTarget.emit('allToFace', false);
        }, this);


        this.backBtnSprite.node.on(Input.EventType.TOUCH_START, () => {
            this.setGamePlayItemState(false);
        }, this);


        Events.eventTarget.on('ResourceLoader:onAllSpritesLoded', (sprites) => {
            this.tilesHandler.spriteFrames = sprites;
        });


        Events.eventTarget.on('play', (index) => {
            switch (index) {
                case 0:
                    this.tilesHandler.columns = 3;
                    this.tilesHandler.rows = 2;
                    break;
                case 1:
                    this.tilesHandler.columns = 4;
                    this.tilesHandler.rows = 3;
                    break;
                case 2:
                    this.tilesHandler.columns = 6;
                    this.tilesHandler.rows = 3;
                    break;
            }

            this.tilesHandler.Reset();


            this.setGamePlayItemState(true);
        });
    }
    start() {

        this.setGamePlayItemState(false);


    }
    setGamePlayItemState(state) {

        if (state) {
            setTimeout(() => {
                this.backBtnSprite.node.active = state;
                this.helpBtnSprite.node.active = state;
            }, 5500);
        } else {
            this.backBtnSprite.node.active = state;
            this.helpBtnSprite.node.active = state;
        }

        if (!state) {
            this.tilesHandler.ToFace(false);

            setTimeout(() => {
                ObjectPool.getInstance().DisableAll(0);
                this.mainMenu.active = !state;

            }, 500);

        }


    }

    restart() {

    }

}