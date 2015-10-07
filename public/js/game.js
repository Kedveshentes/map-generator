define(['three', 'util'],
function (THREE, util) {
    'use strict';
    var game;
    var map3d = [];

    var canvas = {
            width  : 900,
            height : 900
        };
    var step = 5;
    var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer({
            antialiasing : true
        });
		renderer.setSize(canvas.width, canvas.height);
        renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft     = true;

    var light = new THREE.AmbientLight(0x0a0a0a);
        scene.add(light);

    var spotLight = new THREE.SpotLight(0xadadad);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 1;
        spotLight.shadowMapWidth  = 1024;
        spotLight.shadowMapHeight = 1024;
        // spotLight.shadowCameraVisible = true;
        spotLight.shadowCameraNear = 5;
        spotLight.shadowCameraFar  = 200;
        spotLight.shadowCameraFov  = 120;
        scene.add(spotLight);

    var playerGeometry = new THREE.BoxGeometry(0.6 * step, 0.6 * step, 0.6 * step);
    var player = new THREE.Mesh(playerGeometry, new THREE.MeshLambertMaterial({
        color : 0xAAAAFF
    }));
    player.position.z = 1 * step;
    scene.add(player);

    var geometry = new THREE.BoxGeometry(1 * step, 1 * step, 1 * step);

    var handleKeyUp = function (event) {
        pressedKeys[event.keyCode] = false;
    };
    var handleKeyDown = function (event) {
        pressedKeys[event.keyCode] = true;
    };
    var pressedKeys = [];
    var handleKeys = function () {
        if (pressedKeys[37]) {
            // Left cursor key
            player.position.x += -0.2;
            console.log('37');
        }
        if (pressedKeys[39]) {
            // Right cursor key
            player.position.x -= -0.2;
            console.log('39');
        }
        if (pressedKeys[38]) {
            // Up cursor key
            player.position.y -= -0.2;
            console.log('38');
        }
        if (pressedKeys[40]) {
            // Down cursor key
            player.position.y += -0.2;
            console.log('40');
        }
    };

    var update = function () {
        handleKeys();
    }

    // var render = function () {
	// 	requestAnimationFrame(render);
    //     update();
	// 	renderer.render(scene, camera);
	// };

    function mainLoop () {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
    }

    // Start things off
    requestAnimationFrame(mainLoop);


    var cubeFactory = function (cubeType) {
        return new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            color : util.tileTypes[cubeType].color
        }));
    }

    var init = function () {
        document.onkeyup   = handleKeyUp;
        document.onkeydown = handleKeyDown;

    	// render();

        return {
            draw : function (map, width, height) {
                camera.position.x = Math.floor(width / 2 * step);
                camera.position.y = 10 * step;
                camera.position.z = 20 * step;
                camera.lookAt(new THREE.Vector3(Math.floor(width / 2 * step), Math.floor(height / 2 * step), 0));

                spotLight.position.set(-30, height / 1.5, 60 * step);

                for (var y = 0; y < height; y++) {
                    map3d[y] = [];
                    for (var x = 0; x < width; x++) {
                        var cube = cubeFactory(map[x][y]);
                        var z;
                        if (util.tileTypes[map[x][y]].isSolid) {
                            z = 1 * step;
                            cube.castShadow = true;
                        } else {
                            z = 0;
                    		cube.receiveShadow = true;
                        }
                        cube.position.set(x * step, y * step, z);
                        scene.add(cube);
                        map3d[y][x] = cube;
                    }
                }
                spotLight.target = map3d[Math.floor(width / 2)][Math.floor(height / 2)];
            }
        };
    }

    document.body.appendChild(renderer.domElement);

    return {
        getGameInstance : function () {
            if (!game) {
                game = init();
            }
            return game;
        }
    };
});
