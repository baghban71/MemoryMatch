import {  _decorator, Component, UITransform,  Canvas, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('uiSize')
export class uiSize extends Component {
    @property(Canvas)
    mainCanvas: Canvas = null;

    @property(Vec2)
    sizePercent: Vec2 = null;

    canResize: boolean = false;
    timerHandle: number = null;
    GameDiv: HTMLElement = null;
    designWidth: number = 0;
    designHeight: number = 0;
    factorX: number = 1;
    factorY: number = 1;


    canvasUitransform: UITransform = null;
    uitransform: UITransform = null;

    start() {
        this.GameDiv = document.getElementById("GameDiv");
       
        this.uitransform = this.node.getComponent(UITransform);
        
        this.canvasUitransform = this.mainCanvas.getComponent(UITransform);
        this.designWidth = this.canvasUitransform.contentSize.width;
        this.designHeight = this.canvasUitransform.contentSize.height;


    }
    update(deltaTime: number) {
        this.onresize();
    }

    onresize() {
            this.resize();
    }

    public resize(){

        var ratio = this.designWidth / this.designHeight;

        if (window.innerWidth / window.innerHeight > ratio) { // wider
            // so windowsHeight == canvasHeight then ==> canvasWidth = (windowsWidth *   this.designHeight) / windowsHeight
            var w = (window.innerWidth * this.designHeight) / window.innerHeight;
            var h = this.designHeight;

        } else { // heigher
            var w = this.designWidth;
            var h = (window.innerHeight * this.designWidth) / window.innerWidth;
        }

        this.uitransform.width = w * this.sizePercent.x/100;
        this.uitransform.height = h * this.sizePercent.y/100;
    }
}


