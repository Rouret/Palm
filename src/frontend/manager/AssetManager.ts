import {Asset, AssetName} from "../gui/Asset";
import PalmClient from "../PalmClient";

export default class AssetManager {
    assets : Array<Asset> = [];

    public registerAssets(){
        PalmClient.log("Registering assets");
        // example: this.addAsset(AssetName.ICON, "icon.png");
    }

    public addAsset(name: AssetName, endOfUrl : string){
        this.assets.push(new Asset(name, process.env.API_URL + "/public/assets/" + endOfUrl));
    }

    public getAsset(name: AssetName){
        return this.assets.find(asset => asset.name === name);
    }
}