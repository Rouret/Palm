import GUI from "./GUI";
import AssetManager from "../manager/AssetManager";

export default class CanvasGUI implements GUI {
    assetManager: AssetManager;

    constructor() {
        this.assetManager = new AssetManager();
    }


    close(): void {
    }

    open(accept: () => void, reject: () => void): void {
        this.assetManager.registerAssets();
    }

}