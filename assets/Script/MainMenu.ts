import { _decorator, Component, Input, Node, Sprite } from 'cc';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    @property(Sprite)
    playBtnSprite: Sprite = null;

    selectedIndex: Number = 0;

    protected onLoad(): void {




        Events.eventTarget.on('onDifficultySelect', (index) => {
            this.selectedIndex = index;
        });

        this.playBtnSprite.node.on(Input.EventType.TOUCH_START, () => {
            Events.eventTarget.emit('play', this.selectedIndex);
            this.node.active = false;
            // console.log("onDifficultySelect start: ", this.selectedIndex);
        }, this);
    }

    start() {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let state: number = 0;
        if (urlParams.has("state")) {
            state = +urlParams.get('state');
        }
        Events.eventTarget.emit('onDifficultySelect', state);

    }

}


