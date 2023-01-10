import HTTPClient from "./client/HTTPClient";
import {SocketClient} from "./client/SocketClient";
import WebGUI from "./gui/WebGUI";
import CanvasGUI from "./gui/CanvasGUI";

export default class PalmClient {

    public static instance: PalmClient;

    httpClient : HTTPClient;
    socketClient: SocketClient;
    webGUI : WebGUI;
    canvasGUI : CanvasGUI;

    constructor() {
        this.httpClient = new HTTPClient();
        this.socketClient = new SocketClient();
        this.webGUI = new WebGUI();
        this.canvasGUI = new CanvasGUI();
        PalmClient.instance = this;
    }

    private async _isSignIn(){
        return await this.httpClient.getUserInfo()
    }

    async start(){
        if(await this._isSignIn()){
            this.canvasGUI.open(() => {}, () => {});
        }else{
            this.webGUI.open(() => {
                this.webGUI.close();
                this.canvasGUI.open(() => {}, () => {});
            }, () => {
                location.reload();
                this.webGUI.close();
            });
        }
    }


    static log(message: string, type: string = "info"){
        console.log(`[${type.toUpperCase()}] ${message}`)
    }
}