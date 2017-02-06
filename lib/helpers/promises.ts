export interface Resolver<T> {
    (value: T): void;
}
export interface Rejector {
    (err: Error): void;
}
