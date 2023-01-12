import GUI from "./GUI";
import AssetManager from "../manager/AssetManager";
import PalmClient from "../PalmClient";

export default class CanvasGUI implements GUI {
    public static instance: CanvasGUI;
    staticCanvas : HTMLCanvasElement = document.getElementById("static-app") as HTMLCanvasElement;
    canvas : HTMLCanvasElement = document.getElementById("app") as HTMLCanvasElement;
    canvasInterval : any;
    assetManager: AssetManager;
    ctxStatic : CanvasRenderingContext2D;
    ctx : CanvasRenderingContext2D;

    constructor() {
        this.assetManager = new AssetManager();
        this.ctxStatic = this.staticCanvas.getContext("2d");
        this.ctx = this.canvas.getContext("2d");
        CanvasGUI.instance = this;
    }

    close(): void {
    }

    open(accept: () => void, reject: () => void): void {
        this.assetManager.register();
        //Canvas take the full screen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.staticCanvas.width = window.innerWidth;
        this.staticCanvas.height = window.innerHeight;

        this.canvasInterval = setInterval(() => {
            this.draw();
        },1000/PalmClient.FPS);
    }

    draw(){
        //Clear the canvas
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    }

    drawStatic(){

    }

}