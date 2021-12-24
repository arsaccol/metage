import dotenv from 'dotenv'
import {Server} from 'socket.io'

import Game from './game.js'

if(!process.env.NODE_ENV)
    throw "NODE_ENV is not defined! Upon running this script, you need to define this environment variable with something like 'development' or 'production'!"

const envPath = `${process.env.NODE_ENV}.env`

console.log(`Looking for environment variables in file "${envPath}"...`)
dotenv.config({path: envPath})


if( typeof process.env.CLIENT_ORIGIN === 'undefined' || typeof process.env.SOCKET_PORT === 'undefined' )
    throw `
        Environment variable(s) missing! Make sure you have an <environment>.env file, and run this script with a NODE_ENV environment variable set to <environment>
        For example, if you're runing a development environment, precede the node command with NODE_ENV=development and set the required environment variables in a development.env file!
    `


const game = new Game()
