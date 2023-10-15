import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HelpManager')
export class HelpManager extends Component {
    @property(Node)
    hand: Node = null;

    start() {

    }


}


