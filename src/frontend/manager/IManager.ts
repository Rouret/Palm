export default interface IManager<T> {
    add(object: T): void;
    get(objId: string): T;
    register(): void;
    remove(object: T): void;
}