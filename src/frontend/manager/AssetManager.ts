import {Asset, AssetName} from "../gui/Asset";
import PalmClient from "../PalmClient";

export default class AssetManager{
    assets : Array<Asset> = [];

    add(object: Asset): void {
        object.url = process.env.API_URL + "/public/assets/" + object.url;
        this.assets.push(object);
    }

    get(assetName: AssetName): Asset {
        //cast to AssetName
        return this.assets.find(asset => asset.name === assetName);
    }

    register(): void {
        PalmClient.log("Registering assets");
        // example: this.addAsset(AssetName.ICON, "icon.png");
    }

    remove(object: Asset): void {
        this.assets = this.assets.filter(asset => asset.id !== object.id);
    }
}