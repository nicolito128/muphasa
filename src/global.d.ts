import { CustomClient } from "./client"
import * as Plugins from "./plugins"

declare global {
    namespace NodeJS {
        interface Global {
        	Client: CustomClient;
            Plugins: Plugins.PluginSystem;
        }
    }
}
