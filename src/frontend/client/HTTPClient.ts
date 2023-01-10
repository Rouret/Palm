import {User} from "../../backend/entities/User";

export default class HTTPClient{
    public async signIn(email: string, password: string) : Promise<boolean> {
        try{
            const res = await fetch(process.env.API_URL + "/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            return res.status === 200;
        }catch (e){
            console.error(e);
            return false;
        }

    }

    public async signUp(email: string, username: string, password: string) : Promise<boolean> {
        try {
            const res = await fetch(process.env.API_URL + "/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    email
                })
            })
            console.log(res)
            return res.status === 201;
        } catch (e) {
            console.error(e);
            return false;
        }
    }


    public async getUserInfo() : Promise<boolean> {
        try {
            const res = await fetch(process.env.API_URL + "/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            return res.status === 200;
        }catch (e){
            return false;
        }

    }
}