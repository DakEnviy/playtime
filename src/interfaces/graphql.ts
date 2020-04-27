import { GraphQLIsTypeOfFn, GraphQLResolveInfo, GraphQLScalarType, GraphQLTypeResolver } from 'graphql';

import { FilterFieldNamesByType, KeyType, MayPromise, MustBeSubType, RequiredBy } from './common';

export interface FieldResolver<TContext, TParent, TArgs, TResult> {
    (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo): MayPromise<TResult>;
}

export interface ResolverOptionsObjectOriginal<TContext, TRoot, TParent, TArgs, TResult, TTrigger extends KeyType> {
    fragment?: string;
    resolve?: FieldResolver<TContext, Record<TTrigger, TParent>, TArgs, TResult>;
    subscribe?: FieldResolver<TContext, TRoot, TArgs, AsyncIterator<Record<TTrigger, TParent>>>;
    __resolveType?: GraphQLTypeResolver<TParent, TContext>;
    __isTypeOf?: GraphQLIsTypeOfFn<TParent, TContext>;
}

export type ResolverOptionsObject<
    TContext,
    TRoot,
    TParent,
    TArgs,
    TResult,
    TTrigger extends KeyType
> = TParent extends TResult
    ? ResolverOptionsObjectOriginal<TContext, TRoot, TParent, TArgs, TResult, TTrigger>
    : RequiredBy<ResolverOptionsObjectOriginal<TContext, TRoot, TParent, TArgs, TResult, TTrigger>, 'resolve'>;

export interface Resolver<TResult, TArgs = {}> {
    result: TResult;
    args: TArgs;
}

export interface ResolverOptions<TResult, TParent = TResult, TArgs = {}> {
    optionsResult: TResult;
    optionsParent: TParent;
    optionsArgs: TArgs;
}

export interface TypeResolvers<
    TType extends object,
    TMapping extends MustBeSubType<TMapping, TType> = never,
    TParent = unknown
> {
    type: TType;
    mapping: TMapping;
    parent: TParent;
}

export interface EnumResolver<TType extends KeyType, TValue> {
    type: TType;
    value: TValue;
}

export type Resolvers<TResolvers extends object, TContext> = {
    [P in keyof TResolvers]: TResolvers[P] extends TypeResolvers<infer TType, infer TMapping, infer TParent>
        ? {
              [K in Exclude<keyof Required<TType>, FilterFieldNamesByType<TMapping, void>>]: K extends keyof TMapping
                  ? TMapping[K] extends Resolver<infer TResult, infer TArgs>
                      ? FieldResolver<TContext, TParent, TArgs, TResult>
                      : TMapping[K] extends ResolverOptions<infer TResult, infer TInnerParent, infer TArgs>
                      ? ResolverOptionsObject<TContext, TParent, TInnerParent, TArgs, TResult, K>
                      : FieldResolver<TContext, TParent, {}, TMapping[K]>
                  : FieldResolver<TContext, TParent, {}, TType[K]>;
          }
        : TResolvers[P] extends EnumResolver<infer TType, infer TValue>
        ? Record<TType, TValue>
        : TResolvers[P] extends GraphQLScalarType
        ? GraphQLScalarType
        : never;
};
