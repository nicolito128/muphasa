import { CustomClient } from "./client"
import * as Plugins from "./plugins"

declare global {
    namespace NodeJS {
        interface Global {
            Client: CustomClient;
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
