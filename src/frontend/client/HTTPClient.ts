export default class HTTPClient{
    public async signIn(username: string, password: string) : Promise<boolean> {
        if(!username || !password){
            alert("Please enter a username and password");
            return false;
        }
        try{
            const res = await fetch(process.env.API_URL + "/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })

            return res.status === 200;
        }catch (e){
            console.error(e);
            return false;
        }

    }

    public async signUp(username: string, password: string) : Promise<boolean> {
        if(!username || !password){
            alert("Please enter a username and password");
            return false;
        }
        fetch(process.env.API_URL+"/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then((res) => {
            return res.status === 201
        }).catch((err) => {
            return false;
        })
    }
}