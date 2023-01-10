

export class Asset {
    url: string;
    name : AssetName

    constructor( name: AssetName, url: string) {
        this.url = url;
        this.name = name;
    }

}

export enum AssetName {

}
