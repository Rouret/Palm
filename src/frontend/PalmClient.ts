import HTTPClient from "./client/HTTPClient";
import {SocketClient} from "./client/SocketClient";
import WebGUI from "./gui/WebGUI";

export default class PalmClient {

    public static instance: PalmClient;

    httpClient : HTTPClient;
    socketClient: SocketClient;
    webGUI : WebGUI;

    constructor() {
        this.httpClient = new HTTPClient();
        this.socketClient = new SocketClient();
        this.webGUI = new WebGUI();
        PalmClient.instance = this;
    }

    private async _isSignIn(){
        return await this.httpClient.getUserInfo()
    }

    async start(){
        if(await this._isSignIn()){
            console.log("is sign in");
        }else{
            console.log("not sign in");
            this.webGUI.open(() => {
                console.log("accept");
                this.webGUI.close();
            }, () => {
                console.log("reject");
                this.webGUI.close();
            });
        }
        /*
            1. check si on un cookie valide (HTTP REQUEST)
            Oui->
                On lance le CanvasGUI
            Non->
                1.On lance le WebGUI
                2.en attendant l'appel du callback "accept"
                3.on lance le CanvasGUI
         */
    }
}