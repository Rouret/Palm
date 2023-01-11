import { v4 } from 'uuid';

export class Asset {
    id: string;
    url: string;
    name : AssetName

    constructor( name: AssetName, url: string) {
        this.id = v4();
        this.url = url;
        this.name = name;
    }

}

export enum AssetName {

}
