(function (width, height, blocksize, step) {
    'use strict';
    var c          = document.getElementById('canvas'),
        canvas     = c.getContext('2d'),
        directions = [
            {x :   0 , y : - 1}, // up
            {x :   1 , y :   0}, // right
            {x :   0 , y :   1}, // down
            {x : - 1 , y :   0}  // left
        ],
        tileTypes  = {
            0 : {                        // wall
                isSolid : true,
                color   : '#C7C7C7'
            },
            1 : {                        // road
                isSolid : false,
                color   : '#FFFFFF'
            },
            2 : {                        // room
                isSolid : false,
                color   : '#F1F1F1'
            },
            3 : {                        // door
                isSolid : false,
                color   : '#FFC8AD'
            },
            4 : {                        // waypoints
                isSolid : false,
                color   : '#FF0000'
            }
        },
        util = {
            degToRad       : function (degrees) {
    			return degrees * Math.PI / 180;
    		},
            rotationMatrix : function (degrees) {
                return [
                      Math.cos(this.degToRad(degrees)).toFixed(),
                      Math.sin(this.degToRad(degrees)).toFixed(), // should be -
                    - Math.sin(this.degToRad(degrees)).toFixed(), // should be +
                      Math.cos(this.degToRad(degrees)).toFixed()
                ];
            }
        };


        // var vectorUp = [0, -1];
        // vec2.transformMat2(vectorUp, vectorUp, util.rotationMatrix(90));



    var Labyrinth = function (width, height, blocksize, step) {
        this.width     = width;
        this.height    = height;
        this.blocksize = blocksize;
        this.step      = step;
        this.map       = [];
        this.rooms     = [];
        this.deadends  = [];
        this.waypoints = [];

        this.init();
    };

    Labyrinth.prototype.drawBlock = function (x, y, color) {
        canvas.fillStyle = color;
        canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
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
			room.width  = Math.round((Math.round(Math.random() * (roomWidthMax  - roomWidthMin))  + roomWidthMin) / 2) * 2 + 1;
			room.height = Math.round((Math.round(Math.random() * (roomHeightMax - roomHeightMin)) + roomHeightMin) / 2) * 2 + 1;
			room.x      = Math.round((Math.round(Math.random() * (that.width - room.width - 6) + 3)) / 2) * 2 + 1;
			room.y      = Math.round((Math.round(Math.random() * (that.height - room.height - 6) + 3)) / 2) * 2 + 1;
            // random generating a number in an interval, rounding it, divided by two and rounded so it's guaranteed even,
            // multiplied by two, and add 1 to make it odd but around the original size

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
			}
		}
	};
    Labyrinth.prototype.generateLabyrinth = function (currentTile, randomFactor) {
        var roadStack           = [],
            that                = this,
            canPushMoreDeadEnds = true,
            possibleDirections,
            nextBlock,
            direction;

            var checkLabyrinthFill = function () {
                for (var y = 1; y < that.height - 1; y += 2) {
                    for (var x = 1; x < that.width - 1; x += 2) {
                        if (that.map[x][y] === 0) {
                            return {
                                x : x,
                                y : y
                            };
                        }
                    }
                }
                return false;
            };

            var addWaypoints = function () {
                var isThereWayInPrevDirection = false;
                for (var y = 1; y < that.height - 1; y += 2) {
                    for (var x = 1; x < that.width - 1; x += 2) {
                        canvas.fillStyle = '#262FFF';
                        canvas.fillRect(x * that.blocksize, y * that.blocksize, that.blocksize, that.blocksize);
                        for (var i = 0; i < 4; i++) {
                            if (that.map[x + directions[i].x][y + directions[i].y] !== 0) {
                                if (isThereWayInPrevDirection === true) {
                                    that.waypoints.push({
                                        x : x,
                                        y : y
                                    });
                                    canvas.fillStyle = '#F53535';
                                    canvas.fillRect(x * that.blocksize, y * that.blocksize, that.blocksize, that.blocksize);
                                    that.map[x][y] = 4;
                                    isThereWayInPrevDirection = false;
                                    break;
                                } else {
                                    isThereWayInPrevDirection = true;
                                }
                            } else {
                                isThereWayInPrevDirection = false;
                            }
                        }
                        isThereWayInPrevDirection = false;
                    }
                }
                return false;
            };

        var floodFill = function (currentTile) {
            roadStack.push(currentTile);
            that.deadends.push(currentTile);
            that.map[currentTile.x][currentTile.y] = 1;

            while (roadStack.length > 0) {
                possibleDirections = [];
                that.map[currentTile.x][currentTile.y] = 1;

                var checkForBorders = [
                    (currentTile.y > 2),
                    (currentTile.x < that.width - 3),
                    (currentTile.y < that.height - 3),
                    (currentTile.x > 2)
                ];

                var isGivenDirectionPossible = [
                    true, true, true, true
                ];

                for (var i = 0; i < 4; i++) {
                    if (checkForBorders[i]) {
                        isGivenDirectionPossible[i] = isGivenDirectionPossible[i] && (that.map[currentTile.x + directions[i].x * 2][currentTile.y + directions[i].y * 2] !== 1) && (that.map[currentTile.x + directions[i].x * 2][currentTile.y + directions[i].y * 2] !== 2);
                        if (isGivenDirectionPossible[i]) {
                            possibleDirections.push(directions[i]);
                        }
                    }
                }

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
                        x : currentTile.x + direction.x * 2,
                        y : currentTile.y + direction.y * 2
                    };

                    that.map[nextBlock.x - direction.x][nextBlock.y - direction.y] = 1;
                    that.map[nextBlock.x][nextBlock.y] = 1;

                    canPushMoreDeadEnds = true;
                }

                currentTile = nextBlock;
            }
        };

        do {
            floodFill(currentTile);
            currentTile = checkLabyrinthFill();
        } while (currentTile !== false);

        // addWaypoints();
    };
    Labyrinth.prototype.generateDoors = function () {
        var direction    = [0, -1],
            checkOnLeft  = [],
            position,
            roomWidthOrHeight;

        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i].thinWalls = [];
            this.rooms[i].doors     = [];

            position = [0, 0];

            for (var side = 0; side < 4; side++) {
                vec2.transformMat2(direction, direction, util.rotationMatrix(90));
                vec2.transformMat2(checkOnLeft, direction, util.rotationMatrix(90));

                if (direction[0] !== 0) {
                    roomWidthOrHeight = this.rooms[i].width;
                } else {
                    roomWidthOrHeight = this.rooms[i].height;
                }

                var edgeOfRoomCoords;
                var roomWallCoords;
                var beyondTHEWALLCoords;
                var edgeOfRoom;
                var roomWall;
                var beyondTHEWALL;


                for (var r = 0; r < roomWidthOrHeight; r++) {
                    edgeOfRoomCoords    = [this.rooms[i].x + position[0]                     , this.rooms[i].y + position[1]                     ];
                    if (edgeOfRoomCoords[0] === 1 || edgeOfRoomCoords[0] === 49 || edgeOfRoomCoords[1] === 1 || edgeOfRoomCoords[1] === 49) {
                        break;
                    }
                    roomWallCoords      = [this.rooms[i].x + position[0] - checkOnLeft[0]    , this.rooms[i].y + position[1] - checkOnLeft[1]    ];
                    beyondTHEWALLCoords = [this.rooms[i].x + position[0] - checkOnLeft[0] * 2, this.rooms[i].y + position[1] - checkOnLeft[1] * 2];
                    edgeOfRoom    = this.map[edgeOfRoomCoords   [0]][edgeOfRoomCoords   [1]];
                    roomWall      = this.map[roomWallCoords     [0]][roomWallCoords     [1]];
                    beyondTHEWALL = this.map[beyondTHEWALLCoords[0]][beyondTHEWALLCoords[1]];

                    if (tileTypes[roomWall].isSolid && beyondTHEWALL !== undefined && !tileTypes[beyondTHEWALL].isSolid) {
                        this.rooms[i].thinWalls.push({
                            x : roomWallCoords[0],
                            y : roomWallCoords[1]
                        });
                    }
                    vec2.add(position, position, direction);                                                                        // this.drawBlock(edgeOfRoomCoords[0], edgeOfRoomCoords[1], '#74E956');// this.drawBlock(roomWallCoords[0], roomWallCoords[1], '#DEE956');// this.drawBlock(beyondTHEWALLCoords[0], beyondTHEWALLCoords[1], '#E96856');
                }
                vec2.subtract(position, position, direction);                                                                       // this.drawBlock(this.rooms[i].x + position[0], this.rooms[i].y + position[1], '#9D7FC4');// this.drawBlock(this.rooms[i].x + position[0], this.rooms[i].y + position[1], '#341E1A');
            }

            this.rooms[i].doors = _.sample(this.rooms[i].thinWalls, Math.round(Math.random() * 2) + 1);
            for (var j = 0; j < this.rooms[i].doors.length; j++) {
                this.map[this.rooms[i].doors[j].x][this.rooms[i].doors[j].y] = 3;                                                   // this.drawBlock(this.rooms[i].doors[j].x, this.rooms[i].doors[j].y, '#217724');
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

                var direction = [0, 1];

                for (var j = 0; j < 4; j++) { // check if the block is actually a dead end: are there more than 2 path tiles in any direction?
                    blockNextToPotentialDeadEnd = {
                        x : this.deadends[i].x + direction[0],
                        y : this.deadends[i].y + direction[1]
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
                    vec2.transformMat2(direction, direction, util.rotationMatrix(90));
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
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.drawBlock(x, y, tileTypes[this.map[x][y]].color);
            }
        }
    };





    var labyrinth = new Labyrinth (width, height, blocksize, step);
    labyrinth.generateRooms(50, 11, 5, 11, 5); // roomAttempts, pRoomWidthMax, pRoomWidthMin, pRoomHeightMax, pRoomHeightMin
    labyrinth.generateLabyrinth({
        x : 1,
        y : 1
    }, 6); // start position, random factor (0-9, 9 gives maximum random paths)
    labyrinth.draw();
    labyrinth.generateDoors();
    labyrinth.ereaseDeadEnds(); // param : depth of dead end ereasing; if not given, erease all
    labyrinth.draw();

})(51, 51, 5, 1);
