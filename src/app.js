'use strict';

import * as _ from 'underscore';
import { Game } from './game';
import { Labyrinth } from './labyrinth';

import './style.css';

let labyrinthConfig = {
	width          : 10,
	height         : 10,
	// wallThickness  : 1, // default : 10
	size           : 5,
	// step           : 10,
	randomness     : 4,
	write          : false,
	ereaseDeadEnds : 0,
	rooms          : {
		roomAttempts   : 100,
		pRoomWidthMax  : 3,
		pRoomWidthMin  : 1,
		pRoomHeightMax : 3,
		pRoomHeightMin : 1
	}
};

let labyrinth = new Labyrinth(labyrinthConfig);

var game = new Game(labyrinth);
// game.start();
