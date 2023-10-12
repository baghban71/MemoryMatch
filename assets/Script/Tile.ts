import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Event, Input, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    @property(SpriteFrame)
    back: SpriteFrame = null;
    @property(SpriteFrame)
    front: SpriteFrame = null;
    //@property(SpriteFrame)
    // centerSpriteFrame: SpriteFrame = null;

    @property(Sprite)
    centerSprite: Sprite = null;

    isBack: Boolean = true;
    canSelect: Boolean = false;
    @property(CCInteger)
    id: Number = 0;


    @property(CCInteger)
    spriteIndex: number = 0;


    @property(CCFloat)
    scaleFactor: number = 0;

    tweenLength: number = 0.2;
    showHideTweenLength: number = 0.3;

    bgSprite: Sprite = null;

    init() {

        this.isBack = true;
        this.centerSprite.enabled = false;
        this.bgSprite.spriteFrame = this.back;
        this.node.setScale(0.1, 0.1, 0.1);
    }

    start() {
        Events.eventTarget.on('Tile:canSelect', (canSelect: boolean) => {
            this.canSelect = canSelect;
        }, this);

        this.node.on(Input.EventType.TOUCH_START, this.onTouch, this);
        this.bgSprite = this.node.getComponent(Sprite);
        this.init();
    }

    onTouch() {
       // console.log(this.spriteIndex );

        if (!this.canSelect ||  !this.isBack)
            return;

        this.turn();
    }
    turn() {


        tween(this.node)
            .to(this.tweenLength, {
                scale: new Vec3(0.01, this.scaleFactor, this.scaleFactor)                     // Bind scale
            }).call(() => {
                if (this.isBack) {
                   
                    this.bgSprite.spriteFrame = this.front;
                    this.centerSprite.enabled = true;
                } else {
                    this.bgSprite.spriteFrame = this.back;
                    this.centerSprite.enabled = false;
                }
            })
            .to(this.tweenLength, {
                scale: new Vec3(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            })
            .call(() => {
                this.isBack = !this.isBack;

                Events.eventTarget.emit("turn", this);
                // scale: new Vec3(1, 1, 1);
                // position: new Vec3(0, 0, 0);
            }).start();
    }

    hide() {
        tween(this.node)
            .to(this.showHideTweenLength, {
                scale: new Vec3(0.01, 0.01, 1)                     // Bind scale
            }).call(() => {
                this.node.active = false;
                // hide message
            }).start();
    }

    show() {
        this.node.active = true;
        //this.node.setScale(0.01, 0.01, 1);
        tween(this.node)
            .to(this.showHideTweenLength, {
                scale: new Vec3(this.scaleFactor, this.scaleFactor, 1)                     // Bind scale
            }).call(() => {
                this.node.active = true;
                // hide message
            }).start();
    }
    // update(deltaTime: number) {

    // }
}


