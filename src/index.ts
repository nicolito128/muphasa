/**
 * Main File
 * 
 * This is the main Bot app, and the file you should be
 * running to start the bot if you're using it normally.
 * 
*/

// Check for version and dependecies
try {
	[].flatMap(x => x);
} catch (e) {
	throw new Error("We require Node.js version 12 or later; you're using " + process.version);
}

try {
	const sucraseVersion = require('sucrase').getVersion().split('.');
	if (
		parseInt(sucraseVersion[0]) < 3 ||
		(parseInt(sucraseVersion[0]) === 3 && parseInt(sucraseVersion[1]) < 15)
	)
	{
		throw new Error("Sucrase version too old");
	}
} catch (e) {
	throw new Error("Dependencies are unmet; run `node build`.");
}

import { Plugins } from './plugins'
import { App } from './client'
import Config from './Config'

/** Globals  **/
declare const global: any;

global.Client = App
global.Plugins = Plugins
global.Config = Config

/** Plugins **/
Plugins.loader.loadCommands()
App.plugins = Plugins

// Run
App.connect()