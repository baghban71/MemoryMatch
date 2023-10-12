import { _decorator, Component, EventHandler, Node, ToggleContainerComponent } from 'cc';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('ToggleGroup')
export class ToggleGroup extends Component {
    start() {
        const containerEventHandler = new EventHandler();
        // This Node is the node to which your event processing code component belongs
        containerEventHandler.target = this.node;
        // This is the script class name
        containerEventHandler.component = 'ToggleGroup';
        containerEventHandler.handler = 'callback';
        containerEventHandler.customEventData = 'foobar';

        const container = this.node.getComponent(ToggleContainerComponent);
        container.checkEvents.push(containerEventHandler);
        Events.eventTarget.emit('onDifficultySelect', 0);

    }

    callback(event: Event, customEventData: string) {
        ///  console.log("toggle change: ",   event.name , customEventData);
        var target = event.name.replace("<Toggle>", "");
        switch (target) {
            case "Easy":
                Events.eventTarget.emit('onDifficultySelect', 0);
                break;
            case "Normal":
                Events.eventTarget.emit('onDifficultySelect', 1);
                break;
            case "Hard":
                Events.eventTarget.emit('onDifficultySelect', 2);
                break;
        }

    }
}


