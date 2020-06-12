import { TransformableInterface } from './common';

export class CollectionToTreeTransformerOptions {
    rootPropName: string = 'id';
    childPropName: string = 'parentId';
    idPropName: string = 'id';
}

export class CollectionToTreeTransformer implements TransformableInterface {
    constructor(protected options: CollectionToTreeTransformerOptions = new CollectionToTreeTransformerOptions()) {}
    transform(nodes: any[], options?: CollectionToTreeTransformerOptions): any {
        const { rootPropName, childPropName, idPropName } = { ...this.options, ...options };
        const hashTable = nodes.reduce((ht, item) => ((ht[item[rootPropName]] = { ...item }), ht), {});
        return nodes.reduce((roots, node) => {
            const current = hashTable[node[rootPropName]];

            if (!current[childPropName]) {
                roots.push(current);
            } else {
                hashTable[node[childPropName]].children || (hashTable[node[childPropName]].children = []);
                current.parentId = hashTable[node[childPropName]][idPropName];
                hashTable[node[childPropName]].children.push(current);
            }

            return roots;
        }, []);
    }
}
