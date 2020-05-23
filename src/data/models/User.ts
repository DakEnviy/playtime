import { DataTypes, HasManyGetAssociationsMixin, Model, Sequelize } from 'sequelize';

import { AssociableModelStatic } from './index';
import { Message } from './Message';

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
    readonly chatWarns: number;
    readonly chatWarnsUpdatedAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    getMessages: HasManyGetAssociationsMixin<Message>;
}

export type UserStatic = AssociableModelStatic<User>;

export const initUser = (sequelize: Sequelize): UserStatic => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            get(this: User) {
                return this.getDataValue('id').toString();
            },
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

        chatWarns: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },

        chatWarnsUpdatedAt: {
            type: DataTypes.DATE,
        },
    }) as UserStatic;

    User.associate = database => {
        User.hasMany(database.Message, { as: 'messages', foreignKey: 'senderId' });
    };

    return User;
};
