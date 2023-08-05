import { _decorator, Component, Event, Input, Label, Sprite } from 'cc';
import { TilesHandler } from './TilesHandler';
import { Events } from './Events';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {



    @property(Sprite)
    resetBtnSprite: Sprite = null;

    @property(Label)
    faceLableBtn: Label = null;

    @property(Label)
    backLableBtn: Label = null;


    canReset: boolean = true;

    start() {

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


    }

    restart() {

    }

}