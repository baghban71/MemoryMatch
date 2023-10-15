import { assetManager, SpriteFrame, AudioClip, Sprite, ImageAsset, Texture2D, UITransform, _decorator, Component, Node, Asset } from 'cc';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('ResourceLoader')
export class ResourceLoader extends Component {



    sprites: SpriteFrame[] = [];


    @property(Node)
    circularLoading: Node = null;

    start() {
        //this.circularLoading.active = true;
        const queryString = window.location.search;

        const urlParams = new URLSearchParams(queryString);

        let num: number = 1;
        if (urlParams.has("num")) {
            num = +urlParams.get('num');
        }

        this.init(num);
    }
    async init(num: number) {
        let remotUrlBase = `/assets/Levels/Level${num}/`;
        for await (const _element of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            let remoteUrl = remotUrlBase + `${_element}.png`;
            await this.loadSprites(this.sprites, remoteUrl);
        };

        Events.eventTarget.emit('ResourceLoader:onAllSpritesLoded', this.sprites);


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