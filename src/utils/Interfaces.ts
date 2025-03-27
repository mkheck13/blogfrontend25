export interface IBlogItems {
    id: number;
    UserId: number;
    PublisherName: string;
    Date: number;
    Title: string;
    Image: string;
    Description: string;
    Category: string;
    IsPublished: boolean;
    IsDeleted: boolean;
}

//This will be used for our login and create acc fetch
export interface IUserInfo {
    username: string;
    password: string;
}

//This will be used to fetch our user data id and name
export interface IUserData {
    id: number;
    username: string;
}

//Interface for getting our Token
export interface IToken {
    token: string;
}