var canvasElement = document.getElementById('myCanvas');

var canvas = canvasElement.getContext('2d');

function Map (width, height, blocksize) {
	this.width     = width;
	this.height    = height;
	this.blocksize = blocksize;
	this.map       = [];

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
	/*for (var i = 0; i < this.width; i++) {
		for (var j = 0; j < this.height; j++) {
			if (this.map[i][j] == 0) {
				canvas.fillStyle = 'rgb(30, 30, 30)';
			} else {
				canvas.fillStyle = 'rgb(230, 230, 230)';
			}
			canvas.fillRect(i * this.blocksize, j * this.blocksize, this.blocksize, this.blocksize);
		}
	}*/

	canvas.fillStyle = 'rgb(30, 30, 30)';

	var that      = this,
		x         = 0,
		y         = this.height - 1,
		directionProblem = [];


	var count = 0;


	var stepAtRandom = function () {
		var possibleDirections = [0, 1, 2, 3];

		var direction;
		/*do {
			direction = randomizeDirection(possibleDirections);
			
		}
		while (true);*/


		do {
			direction = randomizeDirection(possibleDirections);
			if (direction !== -1) {
				if (checkDirection(possibleDirections[direction])) {
					possibleDirections = [0, 1, 2, 3];
					canvas.fillStyle = 'rgb(' + count * 2 + ', ' + count * 2 + ', ' + count * 2 + ')';
					that.map[x][y] = 1;
					count++;
					canvas.fillRect(x * that.blocksize, y * that.blocksize, that.blocksize, that.blocksize);
				} else {
					possibleDirections.splice(direction, 1);
				}
			}
			console.log(count);
		}
		while (possibleDirections.length != 0);

		for (var i = 0; i < that.width; i++) {
			for (var j = 0; j < that.height; j++) {
				/*console.log(that.map[i][j]);*/
			}
		}

	};



	var checkDirection = function (direction) {


		switch (direction) {
			case 0:
				if (y === 0 || that.map[x][y - 1]) {
					return false;
				}
				y -= 1;
			break;
			case 1:
				if (x == that.width - 1 || that.map[x + 1][y]) {
					return false;
				}
				x += 1;
			break;
			case 2:
				if (y == that.height - 1 || that.map[x][y + 1]) {
					return false;
				}
				y += 1;
			break;
			case 3:
				if (x === 0 || that.map[x - 1][y]) {
					return false;
				}
				x -= 1;
			break;
		}

		return true;
	};

	var randomizeDirection = function (possibleDirections) {
		if (possibleDirections.length !== 0) {
			return possibleDirections[Math.round(Math.random() * (possibleDirections.length - 1))];
		}
		return -1;
	};


	stepAtRandom();

};

var map = new Map(10, 10, 50);

map.generateMap();
map.drawMap();