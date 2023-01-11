import {Asset, AssetName} from "../gui/Asset";
import PalmClient from "../PalmClient";
import IManager from "./IManager";

export default class AssetManager implements IManager<Asset> {
    assets : Array<Asset> = [];

    add(object: Asset): void {
        object.url = process.env.API_URL + "/public/assets/" + object.url;
        this.assets.push(object);
    }

    get(objId: string): Asset {
        return this.assets.find(asset => asset.id === objId);
    }

    register(): void {
        PalmClient.log("Registering assets");
        // example: this.addAsset(AssetName.ICON, "icon.png");
    }

    remove(object: Asset): void {
        this.assets = this.assets.filter(asset => asset.id !== object.id);
    }
}