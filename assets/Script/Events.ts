import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Events')
export class Events extends Component {
    public static eventTarget: EventTarget = new EventTarget();
}


