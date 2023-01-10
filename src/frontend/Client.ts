import {io,Socket} from "socket.io-client";

export default class Client{
    elApp = document.getElementById("app");
    elSignIn = document.getElementById("signin");
    elSignUp = document.getElementById("signup");
    elLoading = document.getElementById("loading");



     private _startSignIn(){
        document.getElementById("launch-signup")
            .addEventListener("click", () => {
                this._startSignUp();
            })

         document.getElementById("signin-button")
            .addEventListener("click", () => {
                const username = (document.getElementById("signin-username") as HTMLInputElement).value;
                const password = (document.getElementById("signin-password") as HTMLInputElement).value;


            })

         this.elSignIn.style.display = "flex";
         this.elApp.style.display  = "none";
         this.elSignUp.style.display = "none";
         this.elLoading.style.display = "none";
     }

    private _startSignUp(){
        document.getElementById("launch-signin")
            .addEventListener("click", () => {
                this._startSignIn();
            })

        document.getElementById("signup-button")
            .addEventListener("click", () => {
                const username = (document.getElementById("signup-username") as HTMLInputElement).value;
                const password = (document.getElementById("signup-password") as HTMLInputElement).value;


            })
        this.elSignUp.style.display = "flex";
        this.elSignIn.style.display = "none";
        this.elApp.style.display  = "none";
        this.elLoading.style.display = "none";
    }

    private _startApp(){

        this.elApp.style.display  = "block";
        this.elSignUp.style.display = "none";
        this.elSignIn.style.display = "none";
        this.elLoading.style.display = "none";
    }

    private _startLoading(){
        this.elApp.style.display  = "none";
        this.elSignUp.style.display = "none";
        this.elSignIn.style.display = "none";
        this.elLoading.style.display = "flex";
    }

    private _initSocket(){
       /* this.socket.on("connect_error", (err) => {
            console.error(err);
            this._startSignIn();
        })

        this.socket.on("connect", () => {
            this._startApp();
            this.socket.on("welcome", (messageFromServer) => {
                console.log(messageFromServer.message);
            });
        })*/
    }
}