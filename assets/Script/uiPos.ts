import { _decorator, Component, UITransform, Canvas, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('uiPos')
export class uiPos extends Component {
    @property(Canvas)
    mainCanvas: Canvas = null;

    @property(Vec2)
    anchor: Vec2 = new Vec2(0,0);

    canResize: boolean = false;
    timerHandle: number = null;
    GameDiv: HTMLElement = null;
    designWidth: number = 0;
    designHeight: number = 0;
    factorX: number = 1;
    factorY: number = 1;

    prevRatio: number = 1;

    uitransform: UITransform = null;

    start() {
        this.GameDiv = document.getElementById("GameDiv");
        this.uitransform = this.mainCanvas.getComponent(UITransform);
        this.designWidth = this.uitransform.contentSize.width;
        this.designHeight = this.uitransform.contentSize.height;

        this.prevRatio = -1;
    }
    
    update(deltaTime: number) {
        this.onresize();
    }

    onresize() {
        if (this.prevRatio == window.innerWidth / window.innerHeight)
            return;
        this.prevRatio = window.innerWidth / window.innerHeight;
        this.resize();
    }
    public resize() {
        var ratio = this.designWidth / this.designHeight;

        this.factorX = (0.5 * (this.anchor.x + 1));
        this.factorY = (0.5 * (this.anchor.y + 1));
        //console.log(  this.prevRatio.toFixed(2));


        if (window.innerWidth / window.innerHeight > ratio) { // wider
            // so windowsHeight == canvasHeight then ==> canvasWidth = (windowsWidth *   this.designHeight) / windowsHeight
            var w = (window.innerWidth * this.designHeight) / window.innerHeight;
            var h = this.designHeight;

        } else { // heigher
            var w = this.designWidth;
            var h = (window.innerHeight * this.designWidth) / window.innerWidth;
        }

        let xDiff = w - this.designWidth;
        let yDiff = h - this.designHeight;

     
        let x = (this.factorX * this.designWidth) + (this.anchor.x * (xDiff / 2));
        let y = (this.factorY * this.designHeight) + (this.anchor.y * (yDiff / 2));

        this.node.setWorldPosition(x, y, 0);
    }
}


