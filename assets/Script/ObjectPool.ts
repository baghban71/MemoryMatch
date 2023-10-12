import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export class ObjectPool extends Component {

    private static instance: ObjectPool;

    public static getInstance(): ObjectPool {
        return ObjectPool.instance;
    }

    @property(Prefab)
    prefabs: Prefab[] = [];


    pooledObjects: Node[][] = [];

    onLoad() {
        ObjectPool.instance = this;
        this.pooledObjects = [];

        this.prefabs.forEach(
            (item) => {
                this.pooledObjects.push([]);

            }
        );
    }


    public GetPooledObject = function (parent, prefabTypeInt) {

        for (var i = 0; i < this.pooledObjects[prefabTypeInt].length; i++) {

            if (!this.pooledObjects[prefabTypeInt][i].active) {
                this.pooledObjects[prefabTypeInt][i].active = true;
                return this.pooledObjects[prefabTypeInt][i];
            }

        }

        var instance = instantiate(this.prefabs[prefabTypeInt]);
        parent.addChild(instance);
        instance.enabled = true;
        this.pooledObjects[prefabTypeInt].push(instance);

        return instance;
    };

    public DisableAll = function (prefabTypeInt) {

        for (var i = 0; i < this.pooledObjects[prefabTypeInt].length; i++)
            this.pooledObjects[prefabTypeInt][i].active = false;

    };
}


