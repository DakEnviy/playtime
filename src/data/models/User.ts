import { DataTypes, Model, Sequelize } from 'sequelize';

import { AssociableModelStatic } from './index';

export interface User extends Model {
    readonly id: string;
    readonly username: string;
    readonly vkId: string;
    readonly avatar: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export type UserStatic = AssociableModelStatic<User>;

export const initUser = (sequelize: Sequelize): UserStatic => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        vkId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }) as UserStatic;
};
