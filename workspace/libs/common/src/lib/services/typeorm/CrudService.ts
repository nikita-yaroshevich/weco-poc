import { EntityManager, Repository } from 'typeorm';
import { from, Observable } from 'rxjs/index';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import { ObjectType } from 'typeorm/common/ObjectType';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { throwIfNull, wrapExceptions } from '../../helpers';
import { NotFoundException } from '../../exceptions';

export class CrudService<T> {
    constructor(protected readonly em: EntityManager, protected TCreator: ObjectType<T>) {}

    protected get repository(): Repository<T> {
        return this.em.getRepository(this.TCreator);
    }

    find(criteria?: FindManyOptions<T>): Promise<T[]> {
        return from(this.repository.find(criteria))
            .pipe(catchError(wrapExceptions))
            .toPromise();
    }

    findById(id, options?: FindOneOptions<T>, repository?: Repository<T>): Promise<T> {
        const repo = repository ? repository : this.repository;
        return from(repo.findOne(id, options))
            .pipe(
                throwIfNull(() => new NotFoundException(`Entity with id '${id}' not found`)),
                catchError(wrapExceptions)
            )
            .toPromise();
    }

    save(entity: any): Promise<T> {
        return from(this.repository.save(entity))
            .pipe(
                switchMap(e => from(this.findById(e.id, { loadRelationIds: true }))),
                catchError(wrapExceptions)
            )
            .toPromise();
    }

    removeById(id: string): Promise<any> {
        return from(this.repository.delete(id))
            .pipe(map(res => res))
            .pipe(
                throwIfNull(() => new NotFoundException(`Entity with id '${id}' not found`)),
                catchError(wrapExceptions)
            )
            .toPromise();
    }
}
