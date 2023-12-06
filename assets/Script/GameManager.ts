import { _decorator, Button, Component, Event, Input, Label, Node, Sprite } from 'cc';
import { TilesHandler } from './TilesHandler';
import { Events } from './Events';
import { Tile } from './Tile';
import { ObjectPool } from './ObjectPool';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    close_btn: Node = null;

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
        Events.eventTarget.on('TilesHandler:isCorrect', (isCorrect: boolean) => {
            let activeTiles = this.getActiveTiles();
            if (isCorrect && activeTiles.length <= 2) {
              //  console.log("----[[ Game Over");
                this.win();
            }
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
            Events.eventTarget.emit('onBackBtnClick');
        }, this);

        this.close_btn.on(Input.EventType.TOUCH_START, () => {
            this.close();
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
    close() {
        if (window.ReactNativeWebView != undefined)
            window.ReactNativeWebView.postMessage(JSON.stringify({ key: "closeClicked" }));


    }

    win() {
        if (window.ReactNativeWebView != undefined)
            window.ReactNativeWebView.postMessage(JSON.stringify({ key: "onWin" }));
    }

    getActiveTiles() {
        let activeTiles = [];
        this.tilesHandler.tiles.forEach(element => {
            if (element.active)
                activeTiles.push(element);

        });
        return activeTiles;
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