import { TransformableInterface } from './common';
import { ItemUpdateEntity } from '../../item/entity/itemUpdate.entity';
import { TaskEntity } from '../../task/entity/task.entity';
import { UpdateItemsModel } from '../../item/model/updateItems.model';
import { TaskType } from '../../task/services/taskType';
import { UpdateStatus } from '../../item/services/updateStatus';
import { TaskStatus } from '../../task/services/taskStatus';

export class ItemUpdateToTaskTransformer implements TransformableInterface {
    transform(itemUpdate: ItemUpdateEntity): TaskEntity {
        const updateContent: UpdateItemsModel = JSON.parse(itemUpdate.payload);
        const siteIds = updateContent.updates.map(update => update.siteId);

        const task = new TaskEntity();
        task.id = itemUpdate.id;
        task.organization = itemUpdate.organization;
        task.type = TaskType.ITEM_UPDATE;
        task.name = itemUpdate.name;
        task.runAt = itemUpdate.runAt;

        switch (itemUpdate.status) {
            case UpdateStatus.SUCCESS:
                task.status = TaskStatus.SUCCESS;
                task.errorMessage = itemUpdate.errorMessage;
                break;
            case UpdateStatus.ERROR:
                task.status = TaskStatus.ERROR;
                task.errorMessage = itemUpdate.errorMessage;
                break;
            default:
                task.status = TaskStatus.ERROR;
                task.errorMessage = 'ERROR';
        }

        task.errorMessage = itemUpdate.errorMessage;
        task.children = siteIds.map(siteId => {
            const childTask = new TaskEntity();
            childTask.payload = siteId;
            return childTask;
        });

        return task;
    }
}
