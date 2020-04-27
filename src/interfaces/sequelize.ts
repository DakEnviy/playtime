import { Model } from 'sequelize';

import { FilterFieldNamesByType } from './common';

export type SerializedModel<TModel extends Model> = Omit<
    TModel,
    keyof Model | FilterFieldNamesByType<TModel, Function>
>;
