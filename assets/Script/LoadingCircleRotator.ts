import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingCircleRotator')
export class LoadingCircleRotator extends Component {

    rotation: number = 0;
    start() {

    }

    update(deltaTime: number) {
        this.rotation -= deltaTime * 100;
        this.node.setRotationFromEuler(0, 0, this.rotation);
    }
}


