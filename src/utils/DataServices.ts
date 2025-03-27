import { IUserData, IUserInfo } from "./Interfaces"


const url = "https://heckermanblog25-gqfxdzfacffuhwed.westus-01.azurewebsites.net/"

//This variable will be used in our getblog by user id fetch when we set them up

let userdata: IUserData;

//Create Account Fetch
export const createAccount = async (user:IUserInfo) => {
    const res = await fetch(url + "User/CreateUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    //If our response is NOT ok we will run this block
    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return data.success;
    }

    const data = await res.json();
    return data.success;
}

//Login Fetch

export const login = async (user:IUserInfo) => {
    const res = await fetch(url + "User/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);

        return null;
    }

    const data = await res.json();
    return data;
}

//Get Logged Data Fetch

