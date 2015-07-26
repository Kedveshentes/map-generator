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

Map.prototype.generateMap = function () {
	for (var i = 0; i < this.width; i++) {
		this.map[i] = [];
		for (var j = 0; j < this.height; j++) {
			this.map[i][j] = 0;
		}
	}

	var count = 0;
	var start = {
		x : 1,
		y : 1
	};
	var direction = Math.round(Math.random() * 3);

	do {
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
	while (count < 20);
};

Map.prototype.drawMap = function () {
};

var map = new Map(50, 50, 10);

map.generateMap();
map.drawMap();