import { IBlogItems, IUserData, IUserInfo } from "./Interfaces"


const url = "https://heckermanblog25-gqfxdzfacffuhwed.westus-01.azurewebsites.net/"

//This variable will be used in our getblog by user id fetch when we set them up

let userdata: IUserData;

//Create Account Fetch
export const createAccount = async (user: IUserInfo) => {
    const res = await fetch(url + "User/CreateUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    //If our response is NOT ok we will run this block
    if (!res.ok) {
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return data.success;
    }

    const data = await res.json();
    return data.success;
}

//Login Fetch

export const login = async (user: IUserInfo) => {
    const res = await fetch(url + "User/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        const data = await res.json();
        const message = data.message;
        console.log(message);

        return null;
    }

    const data = await res.json();
    return data;
}

//Get Logged Data Fetch

export const getLoggedInUserData = async (username: string) => {
    const res = await fetch(url + `User/GetUserInfoByUsername/${username}`)

    if (!res.ok) {
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return null;
    }
    userdata = await res.json();
    // we're not going to use this data inside of a variable we will make a separate function for implementation
    return userdata;
};

// Get the users data
export const loggedInData = () => {
    return userdata;
}

//We're checking if the token is in our storage (see if we are logged in)
export const checkToken = () => {
    let result = false;

    if (typeof window != null) {
        const lsData = localStorage.getItem("Token");

        if (lsData != null) {
            result = true;
        }

    }
    return result;
};

// -------------Blog Endpoints -------------

export const getAllBlogs = async (token:string) =>{
    const res = await fetch(url + "Blog/GetAllBlogs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return[];
    }
    const data = await res.json();
    return data;
}

export const getBlogItemsByUserId = async (userId:number, token:string) =>{
    const res = await fetch(url + "Blog/GetBlogsByUserId/" + userId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return[];
    }
    const data = await res.json();
    return data;
}

export const addBlogItem = async (blog:IBlogItems, token:string) =>{
    const res = await fetch(url + "Blog/AddBlog", {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body:JSON.stringify(blog)

    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return false;
    }
    const data = await res.json();
    // return true we have successfully added our blog to our backend DB
    return data.success;
}

export const upDateBlogItem = async (blog:IBlogItems, token:string) =>{
    const res = await fetch(url + "Blog/EditBlog", {
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body:JSON.stringify(blog)

    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return false;
    }
    const data = await res.json();
    // return true we have successfully added our blog to our backend DB
    return data.success;
}