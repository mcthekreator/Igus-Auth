export interface AuthInterface {
    name: string;
    email: string;
    password: string;
    token: string;
    message: string

}
export interface responseInterface {
    message: string;
    error:{
        message: string
    }

}
