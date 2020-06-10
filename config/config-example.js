/**
 * Bot Configuration
 * 
 * All important data ​​for the bot and connection are saved here
 * When run the bot this file will be used to create config.js
*/
'use strict';

// Token is required to connect to client
/** @type {string} */
exports.token = process.env.TOKEN || ""

// Prefix is ​​the character that the bot uses to identify commands
/** @type {string} */
exports.prefix = process.env.PREFIX || ""

// List of owners id
/** @type {(string | undefined)[]} */
exports.owners = [process.env.OWNERS] || []