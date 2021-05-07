import { CustomClient } from './client'
import * as Plugins from './plugins'
import Config from './Config'

declare global {
    namespace NodeJS {
        interface Global {
        	Client: CustomClient;
            Plugins: Plugins.PluginSystem;
            Config: Config;
        }
    }
}