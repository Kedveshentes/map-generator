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

function Map (width, height, blocksize) {
	this.width       = width;
	this.height      = height;
	this.blocksize   = blocksize;
	this.map         = [];
}
Map.prototype.initializeMap = function () {
	for (var i = 0; i < this.width; i++) {
		this.map[i] = [];
		for (var j = 0; j < this.height; j++) {
			this.map[i][j] = 0;
		}
	}
	this.map.rooms = [];
};
Map.prototype.generateMap = function (roomWidthMin, roomWidthMax, roomHeightMin, roomHeightMax, roomAttempts) {
	this.initializeMap();
	var that = this;

	var generateRooms = function () {
		var room = {};

		var checkRoomCollision = function (room) {
			if (that.map.rooms.length == 0) {
				return false;
			}
			for (var i = 0; i < that.map.rooms.length; i++) {			if (room.x < that.map.rooms[i].x + that.map.rooms[i].width &&
					room.x + room.width > that.map.rooms[i].x &&
					room.y < that.map.rooms[i].y + that.map.rooms[i].height &&
					room.y + room.height > that.map.rooms[i].y) {
				   	return true;
				}
			}
			return false;
		};

		for (var i = 0; i < roomAttempts; i++) {
			room.width  = Math.round(Math.random() * (roomWidthMax  - roomWidthMin))  + roomWidthMin;
			room.height = Math.round(Math.random() * (roomHeightMax - roomHeightMin)) + roomHeightMin;
			room.x      = Math.round(Math.random() * (that.width - room.width));
			room.y      = Math.round(Math.random() * (that.height - room.height));

			if (checkRoomCollision(room) == false) {
				that.map.rooms.push({
					width : room.width,
					height : room.height,
					x : room.x,
					y : room.y
				});

				for (var x = room.x; x < room.x + room.width; x++) {
					for (var y = room.y; y < room.y + room.height; y++) {
						that.map[x][y] = 2;
					}
				}

				canvas.fillStyle = 'rgb(' + Math.round(Math.random() * 100) + ', ' + Math.round(Math.random() * 100) + ', ' + Math.round(Math.random() * 100) + ')';
				canvas.fillRect(
					room.x * that.blocksize,
					room.y * that.blocksize,
					room.width * that.blocksize,
					room.height * that.blocksize
				);
			}
		}
	};

	var start = {
		x : 1,
		y : 1
	};
	var generateLabyrinth = function (currentPosition) {
		var directions = [];
		if ( // up
			(that.map[currentPosition.x - 1][currentPosition.y + 2] !== 1) &&
			(that.map[currentPosition.x    ][currentPosition.y + 2] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y + 2] !== 1) &&
			(that.map[currentPosition.x - 1][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x    ][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y + 1] !== 1)
		) {
			directions.push(0);
		}
		if ( // right
			(that.map[currentPosition.x + 1][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y    ] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y - 1] !== 1) &&
			(that.map[currentPosition.x + 2][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x + 2][currentPosition.y    ] !== 1) &&
			(that.map[currentPosition.x + 2][currentPosition.y - 1] !== 1)
		) {
			directions.push(1);
		}
		if ( // down
			(that.map[currentPosition.x - 1][currentPosition.y - 2] !== 1) &&
			(that.map[currentPosition.x    ][currentPosition.y - 2] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y - 2] !== 1) &&
			(that.map[currentPosition.x - 1][currentPosition.y - 1] !== 1) &&
			(that.map[currentPosition.x    ][currentPosition.y - 1] !== 1) &&
			(that.map[currentPosition.x + 1][currentPosition.y - 1] !== 1)
		) {
			directions.push(2);
		}
		if ( // left
			(that.map[currentPosition.x - 1][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x - 1][currentPosition.y    ] !== 1) &&
			(that.map[currentPosition.x - 1][currentPosition.y - 1] !== 1) &&
			(that.map[currentPosition.x - 2][currentPosition.y + 1] !== 1) &&
			(that.map[currentPosition.x - 2][currentPosition.y    ] !== 1) &&
			(that.map[currentPosition.x - 2][currentPosition.y - 1] !== 1)
		) {
			directions.push(3);
		}
	};

	generateRooms();
	generateLabyrinth(start);





	/*var count = 0;
	var start = {
		x : 1,
		y : 1
	};
	var current = {
		x : 1,
		y : 1
	};
	var direction = Math.round(Math.random() * 3);


	var checkDirection = function (direction) {
		var options = [];

		if (current.y > 0) {
			options.push({
				x : 0,
				y : - 1
			});
		}
		if (current.x < this.map.width) {
			options.push({
				x : 1,
				y : 0
			});
		}
		if (current.y < this.map.height) {
			options.push({
				x : 0,
				y : 1
			});
		}
		if (current.x > 0) {
			options.push({
				x : - 1,
				y : 0
			});
		}

		return options;
	};
	var placeTile = function (direction) {
		this.map[current.x + direction.x][current.y + direction.y] = 1;
	};

	direction = _.sample(checkDirection(direction));


	var generate = function (current, direction) {
		generate()
	};

	generate(current, direction);
*/







	/*do {
		count++;

		switch (direction) {
			case 0:

			break;
			case 1:
			break;
			case 2:
			break;
			case 3:
			break;
		}

	}
	while (count < 20);*/
};

Map.prototype.drawMap = function () {
};

var map = new Map(50, 50, 10);
// roomWidthMin, roomWidthMax, roomHeightMin, roomHeightMax, roomAttempts
map.generateMap(10, 10, 10, 10, 10);
map.drawMap();
