'use strict';

import * as _ from 'underscore';
import { vec2 } from 'gl-matrix';

import { util } from './util';
import { Vector } from './vector';
import { canRoomFit, generateRoomShape, drawRoom, joinRooms } from './generation';

function init (config) {
	let labyrinth = {
		map   : [],
		rooms : []
	};

	for (let i = 0; i < config.height; i++) {
		labyrinth.map[i] = [];
		for (let j = 0; j < config.width; j++) {
			labyrinth.map[i][j] = {
				value: 0,
				type: 'wall',
				position: new Vector(i, j)
			};
		}
	}

	return labyrinth;
};

function addRoom (labyrinth, room) {
	for (let y = room.position[1]; y < room.position[1] + room.height; y++) {
		for (let x = room.position[0]; x < room.position[0] + room.width; x++) {
			labyrinth.map[x][y].value = room.value;
			labyrinth.map[x][y].type = 'room';
			// util.draw(new Vector(x, y), map, config.size, color);
		}
	}
	labyrinth.rooms.push(room);
	return labyrinth;
}

function generateFirstRoom (labyrinth, config) {
	let roomConfig = config.rooms;

	let room = generateRoomShape(roomConfig);
	room.position = new Vector(
		1 + Math.round(Math.random() * (config.width - room.width - 2)),
		1 + Math.round(Math.random() * (config.height - room.height - 2))
	);
	room.value = 0;
	room.type = 'room';
	labyrinth = addRoom(labyrinth, room);
	// labyrinth.rooms.push(room);
	return labyrinth;
	// drawRoom(config, map, room);
}

function generateRooms (config, labyrinth, roomCount) {
	let possiblePositions = [];
	let baseRoom = labyrinth.rooms[roomCount];
	let newRoom = generateRoomShape(config.rooms);
	// drawRoom(config, labyrinth.map, baseRoom, '#ffffff');

	let range = {
		x: {
			from: baseRoom.position[0] - newRoom.width - config.rooms.borderMax,
			to: baseRoom.position[0] + baseRoom.width + config.rooms.borderMax
		},
		y: {
			from: baseRoom.position[1] - newRoom.height - config.rooms.borderMax,
			to: baseRoom.position[1] + baseRoom.height + config.rooms.borderMax
		}
	};

	for (var i = range.x.from; i <= range.x.to; i++) {
		for (var j = range.y.from; j <= range.y.to; j++) {
			if (canRoomFit(new Vector(i, j), newRoom, labyrinth.map, config)) {
				possiblePositions.push(new Vector(i, j));
			}
		}
	}

	if (possiblePositions.length !== 0) {
		newRoom.position = _.sample(possiblePositions);
		newRoom.value = labyrinth.rooms.length;
		labyrinth = addRoom(labyrinth, newRoom);
		roomCount = labyrinth.rooms.length - 1;

		joinRooms(config, labyrinth.map, baseRoom, newRoom);

		labyrinth = generateRooms(config, labyrinth, roomCount);
	} else {
		roomCount--;
		if (roomCount > -1) {
			labyrinth = generateRooms(config, labyrinth, roomCount);
		} else {
			return labyrinth;
		}
	}

	return labyrinth;
}

function draw (config, labyrinth) {
	for (var x = 0; x < config.width; x++) {
		for (var y = 0; y < config.height; y++) {
			util.draw(new Vector(x, y), labyrinth.map, config.size);
		}
	}
}



function generateLabyrinth (config) {
	let labyrinth = init(config);
	labyrinth = generateFirstRoom(labyrinth, config);
	labyrinth = generateRooms(config, labyrinth, 0);
	labyrinth.config = config;
	// draw(config, labyrinth);
	return labyrinth;
}
export { generateLabyrinth };
