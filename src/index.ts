'use strict';

import * as Config from "./../config/config.js"
global.Config = Config

import { Client } from "./client"
global.Client = Client

Client.connect()