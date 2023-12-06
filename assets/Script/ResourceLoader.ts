import { assetManager, SpriteFrame, AudioClip, Sprite, ImageAsset, Texture2D, UITransform, _decorator, Component, Node, Asset } from 'cc';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('ResourceLoader')
export class ResourceLoader extends Component {



    sprites: SpriteFrame[] = [];

    @property(Node)
    blackScreen: Node = null;
    @property(Node)
    circularLoading: Node = null;

    gameHostBase: string = "";

    start() {

        /// console.log(window.location.href);

        // window.location.protocol = “http:”
        // window.location.host = “css - tricks.com”
        // window.location.pathname = “/example/index.html”
        // window.location.search = “?s = flexbox”
        this.gameHostBase = window.location.protocol + "//" + window.location.host + (window.location.pathname != "/" ? "" + window.location.pathname : "");
       // console.log(window.location.host);
        // console.log(window.location.pathname);

        //console.log(this.gameHostBase);

        if (!window.location.host.includes("localhost")) {
            this.circularLoading.active = true;
            this.blackScreen.active = true;

            const queryString = window.location.search;

            const urlParams = new URLSearchParams(queryString);

            let num: number = 1;
            if (urlParams.has("num")) {
                num = +urlParams.get('num');
            }

            this.init(num);
        } else { // test mode
            this.circularLoading.active = false;
            this.blackScreen.active = false;
            // Events.eventTarget.emit('ResourceLoader:onAllSpritesLoded', this.sprites);
            //this.init(num);
        }
    }
    async init(num: number) {
        let remotUrlBase = `assets/Levels/Level${num}/`;
        for await (const _element of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {

            let remoteUrl = this.gameHostBase + remotUrlBase + `${_element}.png`;

            await this.loadSprites(this.sprites, remoteUrl);
        };

        Events.eventTarget.emit('ResourceLoader:onAllSpritesLoded', this.sprites);
        this.circularLoading.active = false;
        this.blackScreen.active = false;
    }

    async loadSprites(_sprites: SpriteFrame[], remoteUrl: string) {
        return new Promise((resolve, reject) => {
            assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;

                if (err) {
                    return reject(err);
                }
                _sprites.push(spriteFrame);
                resolve(imageAsset);
            });
        });
    }
}