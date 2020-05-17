import { IClient } from "./client"
import * as Plugins from "./plugins"

declare global {
    namespace NodeJS {
        interface Global {
            Config: {[k: string]: any};
            Client: IClient;
            Plugins: Plugins.PluginsHandler;
        }
    }

    // Global types
    namespace Types {
        type ICommands = Plugins.ICommands
        type IHelps = Plugins.IHelps;
        type Message = Plugins.Message
    }
}

