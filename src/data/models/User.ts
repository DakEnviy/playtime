import { DataTypes, Model, Sequelize } from 'sequelize';

import { AssociableModelStatic } from './index';

export enum UserRole {
    Default = 'Default',
    Moderator = 'Moderator',
    Admin = 'Admin',
}

export interface User extends Model {
    readonly id: string;
    readonly username: string;
    readonly vkId: string;
    readonly role: UserRole;
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

        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
            defaultValue: UserRole.Default,
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
