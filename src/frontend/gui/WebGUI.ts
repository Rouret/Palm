import GUI from "./GUI";
import PalmClient from "../PalmClient";

export default class WebGUI implements GUI {
    appCanvasEl = document.getElementById("app-container");
    signInSectionEl = document.getElementById("signin");
    signUpSectionEl = document.getElementById("signup");
    buttonGoToSignUp = document.getElementById("launch-signup")
    buttonGotoSignIn = document.getElementById("launch-signin")
    buttonSignUp = document.getElementById("signup-button")
    buttonSignIn = document.getElementById("signin-button")

    private _startSignIn(){
        this.appCanvasEl.style.display  = "none";
        this.signUpSectionEl.style.display = "none";
        this.signInSectionEl.style.display = "block";
    }

    private _startSignUp(){
        this.appCanvasEl.style.display  = "none";
        this.signInSectionEl.style.display = "none";
        this.signUpSectionEl.style.display = "block";
    }

    startApp(): void {
        this.signInSectionEl.style.display = "none";
        this.signUpSectionEl.style.display = "none";
        this.appCanvasEl.style.display  = "block";
    }

    close(): void {
        //remove all listener
        this.buttonGotoSignIn.removeEventListener("click", () => {});
        this.buttonGoToSignUp.removeEventListener("click", () => {});
        this.buttonSignUp.removeEventListener('click', () => {});
        this.buttonSignIn.removeEventListener('click', () => {});

        this.startApp();
    }

    open(accept: () => void, reject: () => void): void {
        this._startSignIn();
        this.buttonGotoSignIn
            .addEventListener("click", () => {
                this._startSignIn();
            })
        this.buttonGoToSignUp
            .addEventListener("click", () => {
                this._startSignUp();
            })

        this.buttonSignUp
            .addEventListener('click', async () => {
                const username = (document.getElementById("signup-username") as HTMLInputElement).value;
                const password = (document.getElementById("signup-password") as HTMLInputElement).value;
                const email = (document.getElementById("signup-email") as HTMLInputElement).value;

                if(!username || !email || !password){
                    alert("Please enter a username, email and password");
                    return;
                }
                const isSignUp = await PalmClient.instance
                    .httpClient
                    .signUp(email,username, password);

                if(isSignUp){
                    this._startSignIn();
                    alert("Sign up successful, please sign in");
                }else{
                    alert("Sign up failed, please try again");
                }
            })

        this.buttonSignIn
            .addEventListener('click', async () => {
                const email = (document.getElementById("signin-email") as HTMLInputElement).value;
                const password = (document.getElementById("signin-password") as HTMLInputElement).value;

                if(!email || !password){
                    alert("Please enter a username and password");
                    return;
                }
                const isSignIn = await PalmClient.instance
                    .httpClient
                    .signIn(email, password);

                if(isSignIn){
                    accept();
                }else{
                    alert("Wrong username or password");
                }
            })
    }
}