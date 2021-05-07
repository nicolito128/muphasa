# Muphasa
![Build Status](https://github.com/nicolito128/muphasa/workflows/Node.js%20CI/badge.svg)
![Dependency Status](https://status.david-dm.org/gh/nicolito128/muphasa.svg)
![devDependency Status](https://status.david-dm.org/gh/nicolito128/muphasa.svg?type=dev)

## Introduction
Muphasa is a **discord-bot** written in Typescript. It includes several commands, but we are at an early development stage.

## Deploy
Clone project:
    
    git clone https://github.com/nicolito128/muphasa

Install dependencies:

    npm install --production

Set environment variable (Powershell):

    $env:BOT_TOKEN = "your discord bot token"
    $env:BOT_OWNER = "your discord tag"
    $env:BOT_PREFIX = "$coolprefix"

In case you use commands that require Giphy, you need to set a **GIPHY_API_KEY**.

Run:

    npm start
    
When everything is configured you can initialize the bot. We recommend using **npm start** to ensure a successful compilation and running.

------------------------------------------------------------------------
Based on [muphasa-bot][1]

[1]: https://github.com/nicolito128/Muphasa-bot