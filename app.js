var canvasElement = document.getElementById('myCanvas');

var canvas = canvasElement.getContext('2d');

/*function Room (width, height) {
	this.width     = width;
	this.height    = height;
	this.field = [];
}
Room.prototype.createRoom = function () {
	for (var i = 0; i < this.width; i++) {
		this.map[i] = [];
		for (var j = 0; j < this.height; j++) {
			this.map[i][j] = 0;
		}
	}
};*/

hallway = {
	hallwayTypes : {
		1 : [                   // 1  : horizontal
			[0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0]
		],
		2 : [                   // 2  : vertical
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0]
		],
		3 : [                   // 3  : up right turn
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 0, 0, 0, 0]
		],
		4 : [                   // 4  : right down turn
			[0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 0]
		],
		5 : [                   // 5  : down left turn
			[0, 0, 0, 0, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[0, 1, 1, 1, 0]
		],
		6 : [                   // 6  : left up turn
			[0, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0]
		],
		7 : [                   // 7  : up fork
			[0, 1, 1, 1, 0],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0]
		],
		8 : [                   // 8  : right fork
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 0]
		],
		9 : [                   // 9  : down fork
			[0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[0, 1, 1, 1, 0]
		],
		10 : [                  // 10 : left fork
			[0, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[0, 1, 1, 1, 0]
		],
		11 : [                  // 11 : up dead end
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 0, 0, 0, 0]
		],
		12 : [                  // 12 : right dead end
			[0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 1, 1, 1, 1],
			[0, 0, 0, 0, 0]
		],
		13 : [                  // 13 : down dead end
			[0, 0, 0, 0, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0]
		],
		14 : [                  // 14 : left dead end
			[0, 0, 0, 0, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0]
		],
		15 : [                  // 15 : cross
			[0, 1, 1, 1, 0],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[0, 1, 1, 1, 0]
		]
	},
	drawHallway : function (x, y, type, magnification) {
		var blockSize = magnification / 5;
		for (var i = 0; i < this.hallwayTypes[type].length; i++) {
			for (var j = 0; j < this.hallwayTypes[type].length; j++) {
				if (hallway.hallwayTypes[type][j][i] == 1) {
					canvas.fillStyle = 'rgb(230, 230, 230)';
					canvas.fillRect(x + i * blockSize, y + j * blockSize, blockSize, blockSize);
				} else {
					canvas.fillStyle = 'rgb(90, 90, 90)';
					canvas.fillRect(x + i * blockSize, y + j * blockSize, blockSize, blockSize);
				}
			}
		}
	}
};


function Map (width, height, hallwaysize) {
	this.width       = width;
	this.height      = height;
	this.hallwaysize = hallwaysize;
	this.map         = [];

}

Map.prototype.generateMap = function () {
	for (var i = 0; i < this.width; i++) {
		this.map[i] = [];
		for (var j = 0; j < this.height; j++) {
			this.map[i][j] = 0;
		}
	}
};

Map.prototype.drawMap = function () {
	var that = this,
		x,
		y,
		hallwayType;

	var isGoingUpObligatory,
		isGoingRightObligatory,
		isGoingDownObligatory,
		isGoingLeftObligatory,
		isGoingUpForbidden,
		isGoingRightForbidden,
		isGoingDownForbidden,
		isGoingLeftForbidden,
		validHallwayTypes,
		possibleHallwayTypes = [];

	var blocksToInitialize = [],
		count              = 0;

	blocksToInitialize.push({
		x : 0,
		y : 0
	});

	possibleHallwayTypes.push(0);
	for (var i = 1; i < 16; i++) {
		possibleHallwayTypes[i] = i;
	}

	do {
		isGoingUpObligatory    = false;
		isGoingRightObligatory = false;
		isGoingDownObligatory  = false;
		isGoingLeftObligatory  = false;
		isGoingUpForbidden     = false;
		isGoingRightForbidden  = false;
		isGoingDownForbidden   = false;
		isGoingLeftForbidden   = false;
		validHallwayTypes      = [];
		x = blocksToInitialize[0].x;
		y = blocksToInitialize[0].y;

		if (this.map[x][y] !== 0) {
			blocksToInitialize.shift();
			continue;
		}

		if (y !== 0 && (this.map[x][y - 1] !== 0 && hallway.hallwayTypes[ this.map[x][y - 1] ][4][2] === 1)) {
			isGoingUpObligatory = true;
		}
		if (y === 0 || y !== 0 && (this.map[x][y - 1] !== 0 && hallway.hallwayTypes[ this.map[x][y - 1] ][4][2] === 0)) {
			isGoingUpForbidden = true;
		}

		if (x !== this.width - 1  && (this.map[x + 1][y] !== 0 && hallway.hallwayTypes[ this.map[x + 1][y] ][2][0] === 1)) {
			isGoingRightObligatory = true;
		}
		if (x === this.width - 1  || x !== this.width - 1  && (this.map[x + 1][y] !== 0 && hallway.hallwayTypes[ this.map[x + 1][y] ][2][0] === 0)) {
			isGoingRightForbidden = true;
		}

		if (y !== this.height - 1 && (this.map[x][y + 1] !== 0 && hallway.hallwayTypes[ this.map[x][y + 1] ][0][2] === 1)) {
			isGoingDownObligatory = true;
		}
		if (y === this.height - 1 || y !== this.height - 1 && (this.map[x][y + 1] !== 0 && hallway.hallwayTypes[ this.map[x][y + 1] ][0][2] === 0)) {
			isGoingDownForbidden = true;
		}

		if (x !== 0 && (this.map[x - 1][y] !== 0 && hallway.hallwayTypes[ this.map[x - 1][y] ][2][4] === 1)) {
			isGoingLeftObligatory = true;
		}
		if (x === 0 || x !== 0 && (this.map[x - 1][y] !== 0 && hallway.hallwayTypes[ this.map[x - 1][y] ][2][4] === 0)) {
			isGoingLeftForbidden = true;
		}
		for (var j = 1; j < possibleHallwayTypes.length; j++) {
			if ((isGoingUpObligatory    && hallway.hallwayTypes[possibleHallwayTypes[j]][0][2] == 1 || isGoingUpForbidden    && hallway.hallwayTypes[possibleHallwayTypes[j]][0][2] === 0 || !isGoingUpObligatory    && !isGoingUpForbidden)    &&
				(isGoingRightObligatory && hallway.hallwayTypes[possibleHallwayTypes[j]][2][4] == 1 || isGoingRightForbidden && hallway.hallwayTypes[possibleHallwayTypes[j]][2][4] === 0 || !isGoingRightObligatory && !isGoingRightForbidden) &&
				(isGoingDownObligatory  && hallway.hallwayTypes[possibleHallwayTypes[j]][4][2] == 1 || isGoingDownForbidden  && hallway.hallwayTypes[possibleHallwayTypes[j]][4][2] === 0 || !isGoingDownObligatory  && !isGoingDownForbidden)  &&
				(isGoingLeftObligatory  && hallway.hallwayTypes[possibleHallwayTypes[j]][2][0] == 1 || isGoingLeftForbidden  && hallway.hallwayTypes[possibleHallwayTypes[j]][2][0] === 0 || !isGoingLeftObligatory  && !isGoingLeftForbidden)) {
				validHallwayTypes.push(j);
			}
		}

		for (var i = 11; i < 15; i++) {
			if (validHallwayTypes.length > 1) {	
				if (validHallwayTypes.indexOf(i) !== -1) {
					validHallwayTypes.splice(validHallwayTypes.indexOf(i), 1);
				}
			}
		}

		hallwayType = _.sample(validHallwayTypes);
		if (hallwayType !== undefined) {
			hallway.drawHallway(x * this.hallwaysize, y * this.hallwaysize, hallwayType, this.hallwaysize);
		}
		this.map[x][y] = hallwayType || 0;

		if (hallway.hallwayTypes[hallwayType][0][2] == 1 && this.map[x][y - 1] === 0) {
			blocksToInitialize.push({
				x : x,
				y : y - 1
			});
		}
		if (hallway.hallwayTypes[hallwayType][2][4] == 1 && this.map[x + 1][y] === 0) {
			blocksToInitialize.push({
				x : x + 1,
				y : y
			});
		}
		if (hallway.hallwayTypes[hallwayType][4][2] == 1 && this.map[x][y + 1] === 0) {
			blocksToInitialize.push({
				x : x,
				y : y + 1
			});
		}
		if (hallway.hallwayTypes[hallwayType][2][0] == 1 && this.map[x - 1][y] === 0) {
			blocksToInitialize.push({
				x : x - 1,
				y : y
			});
		}

		blocksToInitialize.shift();

		count++;
	}
	while (blocksToInitialize.length > 0);
};

var map = new Map(50, 50, 10);

map.generateMap();
map.drawMap();