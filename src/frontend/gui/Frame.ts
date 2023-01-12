import {Asset, AssetName} from "./Asset";
import AssetManager from "../manager/AssetManager";
import CanvasGUI from "./CanvasGUI";

export default abstract class Frame {
    name: string;
    assets : Array<Asset> = [];

    protected constructor(name:string) {
        this.name = name;
        this.registerAsset().forEach(assetName => {
            this.assets.push(
                CanvasGUI.instance
                    .assetManager
                    .get(assetName)
            )
        })

    }

    abstract registerAsset() : Array<AssetName>;
}