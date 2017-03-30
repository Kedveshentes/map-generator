'use strict';

import * as _ from 'underscore';
import { Game } from './game';
// import { generate } from './labyrinth';
import { generate } from '../../../dungeon-generator';

import { config } from './config';

import './style.css';

let dungeon = generate();

var game = new Game(dungeon);
// game.start();
