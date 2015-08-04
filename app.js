(function (width, height, blocksize, step) {
    'use strict';
    var c          = document.getElementById('canvas'),
        canvas     = c.getContext('2d'),
        directions = [
        {x :   0 , y : - 1}, // up
        {x :   1 , y :   0}, // right
        {x :   0 , y :   1}, // down
        {x : - 1 , y :   0}  // left
    ];

    var Labyrinth = function (width, height, blocksize, step) {
        this.width     = width;
        this.height    = height;
        this.blocksize = blocksize;
        this.step      = step;
        this.map       = [];
        this.rooms     = [];
        this.deadends  = [];

        this.init();
    };
    Labyrinth.prototype.init = function () {
        for (var i = 0; i < this.height; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.width; j++) {
                this.map[i][j] = 0;
            }
        }
    };
    Labyrinth.prototype.write = function () {
        var string = '';
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                string += ' ' + this.map[x][y];
            }
            console.log(string);
            string = '';
        }
    };
    Labyrinth.prototype.generateRooms = function (roomAttempts, pRoomWidthMax, pRoomWidthMin, pRoomHeightMax, pRoomHeightMin) {
		var room 		  = {},
			that		  = this,
			roomWidthMax  = pRoomWidthMax  || 10,
			roomWidthMin  = pRoomWidthMin  || 5,
			roomHeightMax = pRoomHeightMax || 10,
			roomHeightMin = pRoomHeightMin || 5;

		var checkRoomCollision = function (room) {
			if (that.rooms.length === 0) {
				return false;
			}
			for (var i = 0; i < that.rooms.length; i++) {
                if (room.x < that.rooms[i].x + that.rooms[i].width &&
					room.x + room.width > that.rooms[i].x &&
					room.y < that.rooms[i].y + that.rooms[i].height &&
					room.y + room.height > that.rooms[i].y) {
				   	return true;
				}
			}
			return false;
		};

		for (var i = 0; i < roomAttempts; i++) {
			room.width  = Math.round(Math.random() * (roomWidthMax  - roomWidthMin))  + roomWidthMin;
			room.height = Math.round(Math.random() * (roomHeightMax - roomHeightMin)) + roomHeightMin;
			room.x      = Math.round(Math.random() * (that.width - room.width - 6) + 3);
			room.y      = Math.round(Math.random() * (that.height - room.height - 6) + 3);

			if (checkRoomCollision(room) === false) {
				that.rooms.push({
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
    Labyrinth.prototype.generateLabyrinth = function (start, randomFactor) {
        var roadStack  = [],
            that       = this;

        var currentTile = start;

        roadStack.push(currentTile);

        var possibleDirections;
        var nextBlock;
        var direction;
        var canPushMoreDeadEnds = true;

        that.map[start.x][start.y] = 1;
        that.deadends.push(start);

        var floodFill = function () {
            while (roadStack.length > 0) {
                possibleDirections = [];
                that.map[currentTile.x][currentTile.y] = 1;

                var checkForBorders = [
                    (currentTile.y > 1),
                    (currentTile.x < that.width - 3),
                    (currentTile.y < that.height - 3),
                    (currentTile.x > 1)
                ];

                var isGivenDirectionPossible = [
                    true, true, true, true
                ];

                var borderValuesForTheLoops = [
                    {
                        xMin : -1,
                        xMax : 1,
                        yMin : -2,
                        yMax : -1
                    },
                    {
                        xMin : 1,
                        xMax : 2,
                        yMin : -1,
                        yMax : 1
                    },
                    {
                        xMin : -1,
                        xMax : 1,
                        yMin : 1,
                        yMax : 2
                    },
                    {
                        xMin : -2,
                        xMax : -1,
                        yMin : -1,
                        yMax : 1
                    }
                ];

                // for 1 step maze
                // for (var i = 0; i < 4; i++) {
                //     if (checkForBorders[i]) {
                //         for (var y = borderValuesForTheLoops[i].yMin; y <= borderValuesForTheLoops[i].yMax; y++) {
                //             for (var x = borderValuesForTheLoops[i].xMin; x <= borderValuesForTheLoops[i].xMax; x++) {
                //                 isGivenDirectionPossible[i] = isGivenDirectionPossible[i] && (that.map[currentTile.x + x][currentTile.y + y] !== 1) && (that.map[currentTile.x + x][currentTile.y + y] !== 2);
                //             }
                //         }
                //         if (isGivenDirectionPossible[i]) {
                //             possibleDirections.push(directions[i]);
                //         }
                //     }
                // }
                // for 1 step maze/
                // ||||||||||||||||||||||||||||||||||||||||||||||||
                // for 2 step maze
                for (var i = 0; i < 4; i++) {
                    if (checkForBorders[i]) {
                        isGivenDirectionPossible[i] = isGivenDirectionPossible[i] && (that.map[currentTile.x + directions[i].x * 2][currentTile.y + directions[i].y * 2] !== 1) && (that.map[currentTile.x + directions[i].x * 2][currentTile.y + directions[i].y * 2] !== 2);
                        if (isGivenDirectionPossible[i]) {
                            possibleDirections.push(directions[i]);
                        }
                    }
                }
                // for 2 step maze/

                if (possibleDirections.length === 0) {
                    nextBlock = roadStack.pop();
                    if (canPushMoreDeadEnds === true) {
                        that.deadends.push(currentTile);
                        canPushMoreDeadEnds = false;
                    }
                } else {
                    roadStack.push(currentTile);
                    if (possibleDirections.indexOf(direction) === -1 || Math.random() * 10 < randomFactor) {
                        direction = _.sample(possibleDirections);
                    }
                    nextBlock = {
                        x : currentTile.x + direction.x,
                        y : currentTile.y + direction.y
                    };
                    that.map[nextBlock.x][nextBlock.y] = 1;
                    nextBlock.x += direction.x;
                    nextBlock.y += direction.y;
                    that.map[nextBlock.x][nextBlock.y] = 1;
                    canPushMoreDeadEnds = true;
                }
                if (nextBlock !== undefined) {
                    // canvas.fillStyle = '#575757';
                    // canvas.fillRect(nextBlock.x * that.blocksize, nextBlock.y * that.blocksize, that.blocksize, that.blocksize);
                    currentTile = nextBlock;
                }
            }
        };
        floodFill();
    };
    Labyrinth.prototype.generateDoors = function () {
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i].thinWalls = [];
            this.rooms[i].doors     = [];

            for (var northEdge = 0; northEdge < this.rooms[i].width; northEdge++) {
                if (this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 1] === 0 &&
                    (this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 2] === 1 || this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 2] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + northEdge,
                        y : this.rooms[i].y - 1
                    });
                }
            }
            for (var eastEdge = 0; eastEdge < this.rooms[i].height; eastEdge++) {
                if (this.map[this.rooms[i].x + this.rooms[i].width][this.rooms[i].y + eastEdge] === 0 &&
                    (this.map[this.rooms[i].x + this.rooms[i].width + 1][this.rooms[i].y + eastEdge] === 1 || this.map[this.rooms[i].x + this.rooms[i].width + 1][this.rooms[i].y + eastEdge] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + this.rooms[i].width,
                        y : this.rooms[i].y + eastEdge
                    });
                }
            }
            for (var southEdge = 0; southEdge < this.rooms[i].width; southEdge++) {
                if (this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height] === 0 &&
                    (this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height + 1] === 1 || this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height + 1] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + southEdge,
                        y : this.rooms[i].y + this.rooms[i].height
                    });
                }
            }
            for (var westEdge = 0; westEdge < this.rooms[i].height; westEdge++) {
                if (this.map[this.rooms[i].x - 1][this.rooms[i].y + westEdge] === 0 &&
                    (this.map[this.rooms[i].x - 2][this.rooms[i].y + westEdge] === 1 || this.map[this.rooms[i].x - 2][this.rooms[i].y + westEdge] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x - 1,
                        y : this.rooms[i].y + westEdge
                    });
                }
            }

            this.rooms[i].doors = _.sample(this.rooms[i].thinWalls, Math.round(Math.random() * 2) + 1);
            for (var j = 0; j < this.rooms[i].doors.length; j++) {
                this.map[this.rooms[i].doors[j].x][this.rooms[i].doors[j].y] = 3;
            }

        }
    };
    Labyrinth.prototype.ereaseDeadEnds = function (depth) {
        var blockNextToPotentialDeadEnd,
            isCurrentReallyDeadEnd,
            newDeadEndCandidates,
            newDeadEndCandidate,
            deleteThemNow,
            isDoorFound,
            counter = 0;

        do {
            newDeadEndCandidates = [];
            deleteThemNow        = [];

            for (var i = 0; i < this.deadends.length; i++) {
                isDoorFound            = false;
                isCurrentReallyDeadEnd = 0;

                for (var j = 0; j < directions.length; j++) { // check if the block is actually a dead end: are there more than 2 path tiles in any direction?
                    blockNextToPotentialDeadEnd = {
                        x : this.deadends[i].x + directions[j].x,
                        y : this.deadends[i].y + directions[j].y
                    };

                    if (this.map[blockNextToPotentialDeadEnd.x][blockNextToPotentialDeadEnd.y] === 3) {
                        isDoorFound = true;
                    }
                    if (this.map[blockNextToPotentialDeadEnd.x][blockNextToPotentialDeadEnd.y] === 1) {
                        isCurrentReallyDeadEnd++;
                        newDeadEndCandidate = {
                            x : blockNextToPotentialDeadEnd.x,
                            y : blockNextToPotentialDeadEnd.y
                        };
                    }
                }
                if (!isDoorFound && isCurrentReallyDeadEnd === 1) { // if there was more than 1 way from a dead end then it wasn't a dead end
                    newDeadEndCandidates.push(newDeadEndCandidate);
                    deleteThemNow.push({
                        x : this.deadends[i].x,
                        y : this.deadends[i].y
                    });
                }
            }
            for (var k = 0; k < deleteThemNow.length; k++) {
                this.map[deleteThemNow[k].x][deleteThemNow[k].y] = 0;
            }
            this.deadends = newDeadEndCandidates;
            counter++;
        } while (depth > counter || (depth === undefined && newDeadEndCandidates.length > 0));
    };
    Labyrinth.prototype.draw = function () {
        var colors = [
            '#C7C7C7', // wall
            '#FFFFFF', // road
            '#F1F1F1', // room
            '#FFC8AD', // door
            '#FF0000'  // whatever else
        ];
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
               canvas.fillStyle = colors[this.map[x][y]];
               canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
            }
        }
    };

    var labyrinth = new Labyrinth(width, height, blocksize, step);
    labyrinth.generateRooms(50, 10, 5, 10, 5); // roomAttempts, pRoomWidthMax, pRoomWidthMin, pRoomHeightMax, pRoomHeightMin
    labyrinth.generateLabyrinth({
        x : 1,
        y : 1
    }, 4); // start position, random factor (0-9), 9 gives maximum random paths
    labyrinth.generateDoors();
    // labyrinth.ereaseDeadEnds(); // param : depth of dead end ereasing; if not given, erease all
    labyrinth.draw();

})(100, 100, 5, 1);
