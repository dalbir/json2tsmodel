import 'reflect-metadata';

import { BaseModel } from '../base-model';
import { RELATION, KEYS } from '../constants';

export interface IRelationInfo {
    type: RELATION;
    model: typeof BaseModel;
}

/**
 * Allows to automatically cast sub models to array of related Model class instances
 *
 * ```typescript
 *  class Author extends BaseModel {
 *      // ...
 *      ＠HasMany(Book)
 *      ＠Cast() books: Book[];
 *      // ...
 *  }
 * ```
 *
 * @param model ModelClass
 */
export function HasMany(model: typeof BaseModel) {
    return function (target: any, propertyKey: string | symbol) {
        const config: IRelationInfo =  {
            type: RELATION.HASMANY,
            model
        };
        Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
    };
}


/**
 * Allows to automatically cast sub models to related Model class instance
 *
 * ```typescript
 *  class Book extends BaseModel {
 *      // ...
 *      ＠HasOne(Author)
 *      ＠Cast() author: Author;
 *      // ...
 *  }
 *  ```
 *
 * @param model ModelClass
 */
export function HasOne(model: typeof BaseModel) {
    return function (target: any, propertyKey: string | symbol) {
        const config : IRelationInfo = {
            type: RELATION.HASONE,
            model
        };
        Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
    };
}
