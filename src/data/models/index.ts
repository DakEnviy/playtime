import { Sequelize, Model } from 'sequelize';
import { forEach } from 'lodash';

import { UserStatic, initUser } from './User';

export type ModelStatic<M extends Model> = typeof Model & { new (): M };

export type AssociableModelStatic<M extends Model> = ModelStatic<M> & {
    associate: (database: Database) => void;
};

function isAssociable<M extends Model>(model: Sequelize | ModelStatic<M>): model is AssociableModelStatic<M> {
    return 'associable' in model;
}

export interface Database {
    sequelize: Sequelize;

    // Models
    User: UserStatic;
}

export const initDatabase = (sequelize: Sequelize): Database => {
    const database: Database = {
        sequelize,
        User: initUser(sequelize),
    };

    forEach(database, model => {
        if (isAssociable(model)) {
            model.associate(database);
        }
    });

    return database;
};
