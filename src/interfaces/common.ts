export type KeyType = string | number | symbol;

export type MayPromise<T> = T | Promise<T>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type MustBeSubType<TSubType extends object, TType extends object> = {
    [P in keyof TSubType]: P extends keyof TType ? unknown : never;
};

export type FilterFieldNamesByType<TObject extends object, TType> = {
    [P in keyof TObject]: TObject[P] extends TType ? P : never;
}[keyof TObject];
