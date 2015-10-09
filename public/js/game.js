define(['three', 'util'],
function (THREE, util) {
    'use strict';
    var game;
    var map3d = [];
    var step       = 10,
        delta      = 0,
		updateStep = 1/60,
		last       = util.timestamp(),
		now;

    var canvas = {
            width  : window.innerWidth,
            height : window.innerHeight
        };

    var scene = new THREE.Scene();

    var gameFieldGeometry,
        gameFieldMaterial,
        gameField;

    gameFieldGeometry = new THREE.PlaneBufferGeometry(30 * step, 30 * step, 1, 1);
    gameFieldMaterial = new THREE.MeshLambertMaterial({color : 0xccccff});
    gameField         = new THREE.Mesh(gameFieldGeometry, gameFieldMaterial);

    gameField.position.x    = 10 * step;
    gameField.position.y    = 10 * step;
    gameField.position.z    = 0.4 * step;
    gameField.castShadow    = true;
    gameField.receiveShadow = true;
    scene.add(gameField);


    var playerGeometry = new THREE.BoxGeometry(0.4 * step, 0.4 * step, 0.4 * step),
        player = new THREE.Mesh(playerGeometry, new THREE.MeshBasicMaterial({
            color : 0xAAAAFF
        }));
        player.position.x = 10 * step;
        player.position.y = 10 * step;
        player.position.z = 1 * step;
        scene.add(player);

	var camera = new THREE.PerspectiveCamera(100, canvas.width / canvas.height, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
		renderer.setSize(canvas.width, canvas.height);
        renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft     = true;

    // var light = new THREE.AmbientLight(0xffffff);
    // var light = new THREE.AmbientLight(0xaaaaaa);
    // var light = new THREE.AmbientLight(0x0a0a0a);
    //     scene.add(light);

    var spotLight = new THREE.SpotLight(0xaaaaaa);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowMapWidth  = 1024;
        spotLight.shadowMapHeight = 1024;
        // spotLight.shadowCameraVisible = true;
        spotLight.shadowCameraNear = 5;
        spotLight.shadowCameraFar  = 200;
        spotLight.shadowCameraFov  = 120;
        // scene.add(spotLight);

    var flashLight = new THREE.SpotLight(
            0xffffff,
            2.0,
            0.0,
            Math.PI/180 * 180,
            10.0,
            2
        );
        flashLight.castShadow = true;
        flashLight.shadowDarkness = 1.0;
        flashLight.shadowMapWidth  = 1024;
        flashLight.shadowMapHeight = 1024;
        flashLight.shadowBias = 0.0001;
        // flashLight.shadowCameraVisible = true;
        flashLight.shadowCameraNear = 0.5 * step;
        flashLight.shadowCameraFar  = 50 * step;
        flashLight.shadowCameraFov  = 120;

        scene.add(flashLight);

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
        if (pressedKeys[87]) {
            // Up cursor key
            player.position.y += 0.05 * step;
            console.log('38');
        }
        if (pressedKeys[65]) {
            // Left cursor key
            player.position.x -= 0.05 * step;
            console.log('37');
        }
        if (pressedKeys[83]) {
            // Down cursor key
            player.position.y -= 0.05 * step;
            console.log('40');
        }
        if (pressedKeys[68]) {
            // Right cursor key
            player.position.x += 0.05 * step;
            console.log('39');
        }
    };

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var flashLightTarget = new THREE.Object3D();
    scene.add(flashLightTarget);

    var onmousemove = function (event) {
        event.preventDefault();
        mouse.x = ( event.clientX / canvas.width ) * 2 - 1;
        mouse.y = - ( event.clientY / canvas.height ) * 2 + 1;
        // console.log(mouse);
    }

    document.onmousemove = onmousemove;
    document.onkeyup     = handleKeyUp;
    document.onkeydown   = handleKeyDown;
    document.body.appendChild(renderer.domElement);

    var update = function () {
        handleKeys(delta);
        flashLight.position.x = player.position.x;
        flashLight.position.y = player.position.y;
        flashLight.position.z = 1 * step;


        camera.lookAt(player.position);
        camera.position.x = player.position.x;
        camera.position.y = player.position.y;
    }
    var render = function () {
		renderer.render(scene, camera);
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects([gameField]);

        if (intersects.length) {
    		// intersects[0].object.material.color.set(0xff0000);
            // flashLight.target.position.x = intersects[0].point.x - 0.5 * step;
            // flashLight.target.position.y = intersects[0].point.y + 0.5 * step;
            // flashLight.target.position.z = intersects[0].point.z + 0.5 * step;



            flashLightTarget.position.x = intersects[0].point.x;
            flashLightTarget.position.y = intersects[0].point.y;
            flashLightTarget.position.z = 1;
            //
            flashLight.target = flashLightTarget;

            // flashLight.target.position.x = mouse.x * step;
            // flashLight.target.position.y = mouse.y * step;
            // flashLight.target.position.z = 2;

            console.log(flashLight.target.position.x + ' ' + flashLight.target.position.y + ' ' + flashLight.target.position.z + ' ');

        }
	};

	var frame = function (timerate) {
		now   = util.timestamp();
		delta = delta + Math.min(1, (now - last) / 1000);
		while (delta > updateStep) {
			delta = delta - updateStep;
			update(delta);
		}
		render(delta);
		last = now;
		requestAnimationFrame(frame);
	};





    function buildAxis (src, dst, colorHex, dashed) {
            var geom = new THREE.Geometry(),
                mat;
            if (dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
            } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
            }
            geom.vertices.push(src.clone());
            geom.vertices.push(dst.clone());
            geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
            var axis = new THREE.Line( geom, mat, THREE.LineSegments );
            return axis;
    }
    function buildAxes (length) {
            var axes = new THREE.Object3D();
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
            axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
            return axes;
    }
    var axes = buildAxes(1000);
    scene.add(axes);





    var init = function () {
        frame();
        return {
            draw : function (map, width, height) {
                // camera.position.x = Math.floor(width / 2 * step);
                camera.position.x = 10 * step;
                camera.position.y = 10 * step;
                camera.position.z = 5 * step;
                // camera.lookAt(new THREE.Vector3(Math.floor(width / 2 * step), Math.floor(height / 2 * step), 0));

                spotLight.position.set(-30, height / 1.5, 60 * step);

                flashLight.target = flashLightTarget;

                for (var y = 0; y < height; y++) {
                    map3d[y] = [];
                    for (var x = 0; x < width; x++) {
                        var cube = cubeFactory(map[x][y]);
                        var z;
                        if (util.tileTypes[map[x][y]].isSolid) {
                            z = 1 * step;
                            cube.castShadow = true;
                    		cube.receiveShadow = true;
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

    return {
        getGameInstance : function () {
            if (!game) {
                game = init();
            }
            return game;
        }
    };
});
