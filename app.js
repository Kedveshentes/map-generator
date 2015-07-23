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
		for (var i = 0; i < this.hallwayTypes[type].length; i++) {
			for (var j = 0; j < this.hallwayTypes[type].length; j++) {
				if (hallway.hallwayTypes[type][i][j] == 1) {
					canvas.fillStyle = 'rgb(230, 230, 230)';
					canvas.fillRect(x + i * 10, y + j * 10, 10, 10);
				} else {
					canvas.fillStyle = 'rgb(30, 30, 30)';
					canvas.fillRect(x + i * 10, y + j * 10, 10, 10);
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
		x    = 0 * this.hallwaysize,
		y    = 0 * this.hallwaysize,
		hallwayType;

	/*hallway.drawHallway(x, y, hallwayType, that.hallwaysize);*/


	for (var i = 0; i < that.width; i++) {
		for (var j = 0; j < that.height; j++) {
			hallwayType = Math.round(Math.random() * 14 + 1);
			that.map[i][j] = hallwayType;
			hallway.drawHallway(i * this.hallwaysize, j * this.hallwaysize, hallwayType, that.hallwaysize);
		}
	}
};

var map = new Map(10, 10, 50);

map.generateMap();
map.drawMap();