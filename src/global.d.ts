import { IClient } from "./client"

declare global {
    namespace NodeJS {
        interface Global {
            Config: {[k: string]: any};
            Client: IClient;
        }
    }
}