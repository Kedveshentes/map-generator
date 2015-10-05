define(['three', 'glMatrix', 'underscore'],
function (THREE, glMatrix, _) {
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
                isSolid  : true,
                material : function () {
                    return new THREE.MeshLambertMaterial({
                        color : 0x827267
                    });
                }
            },
            1 : {                        // road
                isSolid  : false,
                material : function () {
                    return new THREE.MeshLambertMaterial({
                        color : 0xFFFFFF
                    });
                }
            },
            2 : {                        // room
                isSolid  : false,
                material : function () {
                    return new THREE.MeshLambertMaterial({
                        color : 0xF1F1F1
                    });
                }
            },
            3 : {                        // door
                isSolid  : false,
                material : function () {
                    return new THREE.MeshLambertMaterial({
                        color : 0xFFC8AD
                    });
                }
            },
            4 : {                        // waypoints
                isSolid  : false,
                material : function () {
                    return new THREE.MeshLambertMaterial({
                        color : 0xFF0000
                    });
                }
            }
        },
        util = {
            degToRad : function (degrees) {
    			return degrees * Math.PI / 180;
    		},
            rotationMatrix : function (degrees) {
                return [
                      Math.cos(this.degToRad(degrees)).toFixed(),
                      Math.sin(this.degToRad(degrees)).toFixed(), // should be -
                    - Math.sin(this.degToRad(degrees)).toFixed(), // should be +
                      Math.cos(this.degToRad(degrees)).toFixed()
                ];
            },
            containsObject : function (list, object) {
                for (var i = 0; i < list.length; i++) {
                    if (_.isEqual(list[i], object)) {
                        return false;
                    }
                }
                return true;
            },
            turn : function (vector, direction) {
                switch (direction) {
                    case 'left':
                        glMatrix.vec2.transformMat2(vector, vector, util.rotationMatrix(-90));
                        break;
                    case 'right':
                        glMatrix.vec2.transformMat2(vector, vector, util.rotationMatrix(90));
                        break;
                    case 'back':
                        glMatrix.vec2.transformMat2(vector, vector, util.rotationMatrix(180));
                        break;
                    default:
                        console.log('invalid switch direction');
                }
            }
        };

    var Labyrinth = function (config) {
        this.width     = config.width * 2 + 1;
        this.height    = config.height * 2 + 1;
        this.size      = config.size;
        this.step      = config.step;
        this.map       = [];
        this.rooms     = [];
        this.deadends  = [];
        this.waypoints = [];

        this.init(config);
    };
    Labyrinth.prototype.init = function (config) {
        for (var i = 0; i < this.height; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.width; j++) {
                this.map[i][j] = 0;
            }
        }
        this.generateRooms(config.rooms);
        this.generateLabyrinth({
            x : 1,
            y : 1
        }, config.randomness);
        this.generateDoors();
        this.ereaseDeadEnds(config.ereaseDeadEnds); // param : depth of dead end ereasing; if not given, erease all
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
    Labyrinth.prototype.generateRooms = function (config) {
		var room 		  = {},
			that		  = this,
			roomWidthMax  = config.pRoomWidthMax  || 10,
			roomWidthMin  = config.pRoomWidthMin  || 5,
			roomHeightMax = config.pRoomHeightMax || 10,
			roomHeightMin = config.pRoomHeightMin || 5;

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

		for (var i = 0; i < config.roomAttempts; i++) {
			room.width  = Math.round((Math.round(Math.random() * (roomWidthMax  - roomWidthMin))  + roomWidthMin) / 2) * 2 + 1;
			room.height = Math.round((Math.round(Math.random() * (roomHeightMax - roomHeightMin)) + roomHeightMin) / 2) * 2 + 1;
			room.x      = Math.round((Math.round(Math.random() * (that.width - room.width - 6) + 3)) / 2) * 2 + 1;
			room.y      = Math.round((Math.round(Math.random() * (that.height - room.height - 6) + 3)) / 2) * 2 + 1;
            // random generating a number in an interval, rounding it, divided by two and rounded so it's guaranteed even,
            // multiplied by two, and add 1 to make it odd but around the original size

			if (checkRoomCollision(room) === false) {
				that.rooms.push({
					width  : room.width,
					height : room.height,
					x      : room.x,
					y      : room.y
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

                var directionVector = [0, -1];
                for (var i = 0; i < 4; i++) {
                    if (checkForBorders[i]) {
                        var first = currentTile.x + directionVector[0] * 2;
                        var second = currentTile.y + directionVector[1] * 2;
                        isGivenDirectionPossible[i] = isGivenDirectionPossible[i] && tileTypes[that.map[first][second]].isSolid;
                        if (isGivenDirectionPossible[i]) {
                            possibleDirections.push({
                                x : directionVector[0],
                                y : directionVector[1]
                            });
                        }
                    }
                    util.turn(directionVector, 'right');
                }

                if (possibleDirections.length === 0) {
                    nextBlock = roadStack.pop();
                    if (canPushMoreDeadEnds === true) {
                        that.deadends.push(currentTile);
                        canPushMoreDeadEnds = false;
                    }
                } else {
                    roadStack.push(currentTile);

                    var isPreviousDirectionPossible = util.containsObject(possibleDirections, direction);
                    var isPreviousDirectionOverridden = Math.random() * 10 < randomFactor;

                    if (isPreviousDirectionPossible || isPreviousDirectionOverridden) {
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
    };
    Labyrinth.prototype.generateDoors = function () {
        var direction    = [ 1,  0],
            checkOnLeft  = [ 0, -1],
            checkOnRight = [ 0,  1],
            position,
            roomWidthOrHeight = 'width';

        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i].thinWalls = [];
            this.rooms[i].doors     = [];

            position = [this.rooms[i].x, this.rooms[i].y];

            for (var d = 0; d < 4; d++) {
                if (
                    (roomWidthOrHeight === 'height' && (position[0] > 1 && position[0] < this.width  - 3)) ||
                    (roomWidthOrHeight === 'width'  && (position[1] > 1 && position[1] < this.height - 3))
                ) {
                    for (var j = 0; j < this.rooms[i][roomWidthOrHeight]; j++) {
                        var checkThisBlock = [position[0] + 2 * checkOnLeft[0], position[1] + 2 * checkOnLeft[1]];
                        if (!tileTypes[this.map[checkThisBlock[0]][checkThisBlock[1]]].isSolid) {
                            this.rooms[i].thinWalls.push({
                                x : position[0] + checkOnLeft[0],
                                y : position[1] + checkOnLeft[1]
                            });
                        }
                        position[0] = position[0] + direction[0];
                        position[1] = position[1] + direction[1];
                    }
                } else {
                    var steps = (roomWidthOrHeight === 'height' ? this.rooms[i].height : this.rooms[i].width);
                    position[0] = position[0] + direction[0] * steps;
                    position[1] = position[1] + direction[1] * steps;
                }
                // step back a bit, because we moved trough the wall
                position[0] = position[0] - direction[0];
                position[1] = position[1] - direction[1];
                roomWidthOrHeight = (roomWidthOrHeight === 'width' ? 'height' : 'width');

                util.turn(direction,    'right');
                util.turn(checkOnLeft,  'right');
                util.turn(checkOnRight, 'right');
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
                    glMatrix.vec2.transformMat2(direction, direction, util.rotationMatrix(90));
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
    Labyrinth.prototype.draw = function (step) {
        var canvas = {
            width  : 900,
            height : 900,
        };

        var scene = new THREE.Scene();

		var camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 1000);
            camera.position.x = Math.floor(this.width / 2 * step);
            camera.position.y = 20 * step;
            camera.position.z = 40 * step;
            camera.lookAt(new THREE.Vector3(Math.floor(this.width / 2 * step), Math.floor(this.height / 2 * step), 0));


		var renderer = new THREE.WebGLRenderer({
                antialiasing : true
            });
    		renderer.setSize(canvas.width, canvas.height);
            renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft     = true;

		document.body.appendChild(renderer.domElement);

        var map3d = [];
        var geometry = new THREE.BoxGeometry(1 * step, 1 * step, 1 * step);

        var light = new THREE.AmbientLight(0x0a0a0a);
        scene.add(light);

        var spotLight = new THREE.SpotLight(0xadadad);
            spotLight.position.set(-30, this.height / 1.5, 60 * step); // this.width / 1.5

            spotLight.castShadow = true;

            spotLight.shadowDarkness = 1;

            spotLight.shadowMapWidth  = 1024;
            spotLight.shadowMapHeight = 1024;

            spotLight.shadowCameraVisible = true;
            spotLight.shadowCameraNear    = 5;
            spotLight.shadowCameraFar     = 200;
            spotLight.shadowCameraFov     = 120;

        scene.add(spotLight);

        function cubeFactory (cubeType) {
            return tileTypes[cubeType].material();
        }

        for (var y = 0; y < this.height; y++) {
            map3d[y] = [];
            for (var x = 0; x < this.width; x++) {
                var cube = new THREE.Mesh(geometry, cubeFactory(this.map[x][y]));
                // var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                //         map : THREE.ImageUtils.loadTexture('minecraft_brick.jpg')
                //     }));
                cube.position.x = x * step;
                cube.position.y = y * step;
                if (tileTypes[this.map[x][y]].isSolid) {
                    cube.position.z = 1 * step;
                    cube.castShadow    = true;
                } else {
            		cube.receiveShadow = true;
                }
                scene.add(cube);
                map3d[y][x] = cube;
            }
        }

        spotLight.target = map3d[Math.floor(this.width / 2)][Math.floor(this.height / 2)];

        var render = function () {
			requestAnimationFrame(render);
			// cube.rotation.x += 0.1;
			// cube.rotation.y += 0.1;
			renderer.render(scene, camera);
		};

		render();
    };

    return Labyrinth;
});
