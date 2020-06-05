/**
 * Main File
 * 
 * This is the main Bot app, and the file you should be
 * running to start the bot if you're using it normally.
 * 
*/

// Check for version
try {
	RegExp("\\p{Emoji}", "u");
} catch (e) {
	throw new Error("We require Node.js version 10 or later; you're using " + process.version);
}

/**********************
 * Set globals
 **********************/
declare const global: any

import * as Config from "./../config/config.js"
global.Config = Config

import { Client } from "./client"
global.Client = Client

import { Plugins } from "./plugins"
global.Plugins = Plugins

// Load plugins
try {
    Plugins.loader.loadPlugins()
} catch (err) {
    if (err) throw err
}

Client.connect()