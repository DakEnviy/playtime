import { Sequelize, Model } from 'sequelize';
import { forEach } from 'lodash';

import { initSetting, SettingStatic } from './Setting';
import { initUser, UserStatic } from './User';
import { initMessage, MessageStatic } from './Message';

export type ModelStatic<M extends Model> = typeof Model & { new (): M };

export type AssociableModelStatic<M extends Model> = ModelStatic<M> & {
    associate: (database: Database) => void;
};

function isAssociable(model: Sequelize | ModelStatic<Model>): model is AssociableModelStatic<Model> {
    return 'associate' in model;
}

export interface Database {
    sequelize: Sequelize;

    // Models
    Setting: SettingStatic;
    User: UserStatic;
    Message: MessageStatic;
}

export const initDatabase = (sequelize: Sequelize): Database => {
    const database: Database = {
        sequelize,
        Setting: initSetting(sequelize),
        User: initUser(sequelize),
        Message: initMessage(sequelize),
    };

    forEach(database, model => {
        if (isAssociable(model)) {
            model.associate(database);
        }
    });

    return database;
};
