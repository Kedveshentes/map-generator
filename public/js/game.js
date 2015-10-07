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

    var playerGeometry = new THREE.BoxGeometry(0.6 * step, 0.6 * step, 0.6 * step);
    var player = new THREE.Mesh(playerGeometry, new THREE.MeshLambertMaterial({
        color : 0xAAAAFF
    }));
    player.position.x = 10 * step;
    player.position.y = 10 * step;
    player.position.z = 1 * step;
    scene.add(player);

	var camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 100);
    camera.position.x = 10 * step;
    camera.position.y = 10 * step;
    camera.position.z = 20 * step;
        // camera.lookAt(player.position);
	var renderer = new THREE.WebGLRenderer();
		renderer.setSize(canvas.width, canvas.height);
        // renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMapSoft     = true;

    var light = new THREE.AmbientLight(0x0a0a0a);
    // var light = new THREE.AmbientLight(0xffffff);
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

    var geometry = new THREE.BoxGeometry(1 * step, 1 * step, 1 * step);


    var cubeFactory = function (cubeType) {
        return new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            color : util.tileTypes[cubeType].color
        }));
    }
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
            player.position.x -= 1;
            console.log('37');
        }
        if (pressedKeys[39]) {
            // Right cursor key
            player.position.x += 1;
            console.log('39');
        }
        if (pressedKeys[38]) {
            // Up cursor key
            player.position.y += 1;
            console.log('38');
        }
        if (pressedKeys[40]) {
            // Down cursor key
            player.position.y -= 1;
            console.log('40');
        }
    };

    var update = function () {
        handleKeys();
    }

    var rendering = function () {
		renderer.render(scene, camera);
	};



    var that        = this,
		dt          = 0,
		now,
		asdstep     = 1/60,
		last        = util. timestamp();

	var frame = function () {
		// that.utils.fpsmeter.tickStart();
		now  = util.timestamp();
		dt   = dt + Math.min(1, (now - last) / 1000);
		while (dt > asdstep) {
			dt = dt - asdstep;
			update(asdstep);
			console.log('asd');
		}
		rendering(dt);
		last = now;
		requestAnimationFrame(frame);
	};
    var init = function () {
    	// render();
        frame();
        return {
            draw : function (map, width, height) {
                // camera.position.x = Math.floor(width / 2 * step);
                // camera.position.y = 10 * step;
                // camera.position.z = 20 * step;
                // camera.lookAt(new THREE.Vector3(Math.floor(width / 2 * step), Math.floor(height / 2 * step), 0));

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
    document.onkeyup     = handleKeyUp;
    document.onkeydown   = handleKeyDown;
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
