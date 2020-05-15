'use strict';

import * as Config from "./../config/config.js"
global.Config = Config

import { Client } from "./client"
global.Client = Client

import { Plugins } from "./plugins"
global.Plugins = Plugins

// Load plugins
Plugins.loadPlugins()

Client.connect()