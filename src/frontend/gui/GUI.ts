export default interface GUI{
    open(accept: () => void, reject: () => void) : void;
    close() : void;
}