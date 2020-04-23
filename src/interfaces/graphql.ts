import { ModuleContext } from '@graphql-modules/core';
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';

export type MayPromise<T> = T | Promise<T>;

export interface FieldResolver<TContext, TParent, TArgs, TResult> {
    (parent: TParent, args: TArgs, context: ModuleContext<TContext>, info: GraphQLResolveInfo): MayPromise<TResult>;
}

export interface Resolver<TResult, TArgs = {}> {
    result: TResult;
    args: TArgs;
}

export type MustBeSubType<SubType extends object, Type extends object> = {
    [P in keyof SubType]: P extends keyof Type ? unknown : never;
};

export interface TypeResolvers<
    TType extends object,
    TMapping extends MustBeSubType<TMapping, TType> = never,
    TParent = unknown
> {
    type: TType;
    mapping: TMapping;
    parent: TParent;
}

export interface EnumResolver<TType extends string | number | symbol, TValue> {
    type: TType;
    value: TValue;
}

export type Resolvers<TResolvers extends object, TContext> = {
    [P in keyof TResolvers]: TResolvers[P] extends TypeResolvers<infer TType, infer TMapping, infer TParent>
        ? {
              [K in keyof Required<TType>]: K extends keyof TMapping
                  ? TMapping[K] extends Resolver<infer TResult, infer TArgs>
                      ? FieldResolver<TContext, TParent, TArgs, TResult>
                      : FieldResolver<TContext, TParent, {}, TMapping[K]>
                  : FieldResolver<TContext, TParent, {}, TType[K]>;
          }
        : TResolvers[P] extends EnumResolver<infer TType, infer TValue>
        ? Record<TType, TValue>
        : TResolvers[P] extends GraphQLScalarType
        ? GraphQLScalarType
        : never;
};
