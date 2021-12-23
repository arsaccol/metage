import dotenv from 'dotenv'
import {Server} from 'socket.io'

import Game from './game.js'

dotenv.config()

const game = new Game()
