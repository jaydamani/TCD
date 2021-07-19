import { MainClient } from "./client";

export abstract class Base{

    abstract name : string
    abstract description : string
    abstract run(...a : any[]) : any

    //this decides how it should be handled
    abstract make(client : MainClient) : void

}