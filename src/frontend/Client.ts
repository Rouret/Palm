import {io,Socket} from "socket.io-client";

export default class Client{
    socket: Socket;
    elApp = document.getElementById("app");
    elSignIn = document.getElementById("signin");
    elSignUp = document.getElementById("signup");


    constructor() {
        this.socket = io();
        this._initSocket();
    }

     private _startSignIn(){
        document.getElementById("launch-signup")
            .addEventListener("click", () => {
                this._startSignUp();
            })

         document.getElementById("signin-button")
            .addEventListener("click", () => {
                const username = (document.getElementById("signin-username") as HTMLInputElement).value;
                const password = (document.getElementById("signin-password") as HTMLInputElement).value;

                if(!username || !password){
                    alert("Please enter a username and password");
                    return;
                }
                fetch("http://localhost:3000/auth/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }).then((res) => {
                    if(res.status === 200){
                        this._startApp();
                    }else{
                        alert("Invalid username or password");
                    }
                }).catch((err) => {
                    console.error(err);
                    alert("Invalid username or password");
                })
            })

         this.elSignIn.style.display = "flex";
         this.elApp.style.display  = "none";
         this.elSignUp.style.display = "none";
     }

    private _startSignUp(){
        document.getElementById("launch-signin")
            .addEventListener("click", () => {
                this._startSignIn();
            })
        this.elSignUp.style.display = "flex";
        this.elSignIn.style.display = "none";
        this.elApp.style.display  = "none";
    }

    private _startApp(){
        this.elApp.style.display  = "block";
        this.elSignUp.style.display = "none";
        this.elSignIn.style.display = "none";
    }

    private _initSocket(){
        this.socket.on("connect_error", (err) => {
            this._startSignIn();
        })

        this.socket.on("connect", () => {
            this._startApp();
            this.socket.emit("init", {
                message:"Hello World! From the frontend!"
            });
            this.socket.on("welcome", (messageFromServer) => {
                console.log(messageFromServer.message);
            });
        })
    }
}