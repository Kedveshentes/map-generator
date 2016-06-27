import * as THREE from 'three';

import { util, step, canvas } from './util';
import { Player } from './player';
import { World } from './world';

var geometry = new THREE.BoxGeometry(1 * step, 1 * step, 1 * step);
var cubeFactory = function (cubeType) {
	return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
		color : util.tileTypes[cubeType].color
		// ,
		// map   : tileTexture
	}));
}

var middleOfWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);

var fullUpWallGeometry    = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var fullRightWallGeometry = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var fullDownWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var fullLeftWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);

var thinUpWallGeometry    = new THREE.BoxGeometry(0.2 * step, 0.4 * step, 1 * step);
var thinRightWallGeometry = new THREE.BoxGeometry(0.4 * step, 0.2 * step, 1 * step);
var thinDownWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.4 * step, 1 * step);
var thinLeftWallGeometry  = new THREE.BoxGeometry(0.4 * step, 0.2 * step, 1 * step);

var cornerRUWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var cornerRDWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var cornerLDWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);
var cornerLUWallGeometry  = new THREE.BoxGeometry(0.2 * step, 0.2 * step, 1 * step);








class Game {
	constructor (labyrinth) {
		// if (!game) {
		// 	game = this;
		// }
		this.world = new World(labyrinth);

		this.map3d = [];

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();


		// let playerGeometry = new THREE.BoxGeometry(0.3 * step, 0.3 * step, 0.3 * step);
		// this.player = new THREE.Mesh(playerGeometry, new THREE.MeshBasicMaterial({
		// 	color : '#3b2ed5'
		// }));
		// this.player.position.set(10 * step, 10 * step, 0.15 * step);
		// // this.player.castShadow = true;
		// this.world.scene.add(this.player);

		// let testGeometry = new THREE.BoxGeometry(1, 1, 1);
		// this.test = new THREE.Mesh(testGeometry, new THREE.MeshBasicMaterial({
		// 	color : 0xB1C1FF
		// }));
		// this.test.position.set(0, 0, 0);
		// this.test.castShadow = true;
		// this.world.scene.add(this.test);





		this.player = new Player(this.world);






		// this.playerAura = new THREE.PointLight(0xffffff, 0.5, 0.15 * step);
		// this.world.scene.add(this.playerAura);
		//
		// this.flashLight = new THREE.SpotLight(0xffffff);
		//
		// this.flashLight.intensity = 1.0;
		// this.flashLight.distance = 80 * step;
		// this.flashLight.angle = Math.PI/180 * 40;
		// this.flashLight.decay = 1;
		//
		// this.flashLight.castShadow = true;
		// this.flashLight.shadow.darkness = 1.0;
		// this.flashLight.shadow.mapSize.width  = 1024;
		// this.flashLight.shadow.mapSize.height = 1024;
		// this.flashLight.shadow.bias = 0.0001;
		// // this.flashLight.shadowCameraVisible = true;
		// this.flashLight.shadow.camera.near = 0.1;
		// this.flashLight.shadow.camera.far = 80 * step;
		// this.flashLight.shadow.camera.fov = 120;
		// this.flashLight.penumbra = 0.1;

		// THREE.CameraHelper(this.flashLight.shadow.camera);

		// this.world.scene.add(this.flashLight);

		this.flashLightTarget = new THREE.Object3D();
		this.world.scene.add(this.flashLightTarget);

		this.distanceOfPlayerAndMouse = new THREE.Vector2();

		this.pressedKeys = [];
		var handleKeyUp = (event) => {
			this.pressedKeys[event.keyCode] = false;
		};
		var handleKeyDown = (event) => {
			this.pressedKeys[event.keyCode] = true;
		};
		var onmousemove = (event) => {
			event.preventDefault();
			this.mouse.x = ( event.clientX / canvas.width ) * 2 - 1;
			this.mouse.y = - ( event.clientY / canvas.height ) * 2 + 1;
			// console.log(mouse);
		}

		document.onmousemove = onmousemove;
		document.onkeyup     = handleKeyUp;
		document.onkeydown   = handleKeyDown;
		document.body.appendChild(this.world.renderer.domElement);


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
		this.world.scene.add(axes);

		this.labyrinth = labyrinth;
		this.start();
	}

	start() {
		this.render();
		this.draw();
	}

	handleKeys () {
		if (this.pressedKeys[87]) {
			// Up cursor key
			this.player.mesh.position.y += this.player.velocity;
		}
		if (this.pressedKeys[65]) {
			// Left cursor key
			this.player.mesh.position.x -= this.player.velocity;
		}
		if (this.pressedKeys[83]) {
			// Down cursor key
			this.player.mesh.position.y -= this.player.velocity;
		}
		if (this.pressedKeys[68]) {
			// Right cursor key
			this.player.mesh.position.x += this.player.velocity;
		}
	};

	render () {
		requestAnimationFrame(() => {
			this.render();
		});

		this.handleKeys();
		this.update();
		this.world.render();
	}

	update () {
		this.player.flashLight.position.set(this.player.mesh.position.x, this.player.mesh.position.y, 0.4 * step);
		this.player.flashLightHelper.update();
		this.player.aura.position.set(this.player.mesh.position.x, this.player.mesh.position.y, 0.4 * step);
		this.raycaster.setFromCamera(this.mouse, this.world.camera);

		let intersects = this.raycaster.intersectObjects([this.world.gameField]);

		if (intersects.length) {
			this.flashLightTarget.position.x = intersects[0].point.x;
			this.flashLightTarget.position.y = intersects[0].point.y;
			this.flashLightTarget.position.z = 1;
			this.player.flashLight.target = this.flashLightTarget;

			this.distanceOfPlayerAndMouse.x = intersects[0].point.x - this.player.mesh.position.x;
			this.distanceOfPlayerAndMouse.y = intersects[0].point.y - this.player.mesh.position.y;

			// this.camera.position.x = this.player.mesh.position.x + this.distanceOfPlayerAndMouse.x / 6;
			// this.camera.position.y = this.player.mesh.position.y + this.distanceOfPlayerAndMouse.y / 6;

			this.world.camera.position.x = this.player.mesh.position.x;
			this.world.camera.position.y = this.player.mesh.position.y;
			// this.player.mesh.lookAt(intersects[0].point);
		}
		this.world.camera.lookAt(this.player.mesh.position);
		// this.spotLight.position.set(-30, this.labyrinth.height / 1.5, 60 * step);
		this.player.flashLight.target = this.flashLightTarget;
	}

	draw () {
		// var flippedMap = [];
		// for (var i = 0; i < this.labyrinth.map.length; i++) {
		// 	flippedMap.push(this.labyrinth.map[this.labyrinth.map.length - 1 - i]);
		// }

		this.drawLabyrinthTiles();
	}

	drawLabyrinthTiles () {
		let wallsGeometry = new THREE.Geometry();

		for (var y = 0; y < this.labyrinth.height; y++) {
			this.map3d[y] = [];
			for (var x = 0; x < this.labyrinth.width; x++) {
				var cube = cubeFactory(this.labyrinth.map[y][x]);
				var z;
				var wall;
				if (util.tileTypes[this.labyrinth.map[y][x]].isSolid) {

					wall = this.wallGenerator(this.labyrinth.map, x, y);

					wall.castShadow = true;
					wall.receiveShadow = true;
					wall.position.set(x * step, y * step, 1 * step);

					wall.updateMatrix();
					wallsGeometry.merge(wall.geometry, wall.matrix);
					// this.world.scene.add(wall);
				}
				cube.receiveShadow = true;
				cube.position.set(x * step, y * step, -10);
				this.map3d[y][x] = cube;
				// this.world.scene.add(cube);
			}
		}

		let walls = new THREE.Mesh(wallsGeometry, new THREE.MeshPhongMaterial({
			color : util.tileTypes[0].color
		}));

		walls.castShadow = true;
		walls.receiveShadow = true;
		// console.log(walls);
		walls.position.z = - 0.5 * step;
		this.world.scene.add(walls);
	}

	wallGenerator (map, xCoord, yCoord) {
		var wallMatrix = [
			[],
			[],
			[],
		];
		var currentWall = new THREE.Geometry();

		var position = new THREE.Vector2(-1, -1);

		var mapTile;

		for (var y = 0; y < 3; y++) {
			position.x = -1;
			for (var x = 0; x < 3; x++) {
				if (map[yCoord + position.y] === undefined || map[yCoord + position.y][xCoord + position.x] === undefined) {
					wallMatrix[y][x] = false;
				} else {
					mapTile = map[yCoord + position.y][xCoord + position.x];
					wallMatrix[y][x] = util.tileTypes[mapTile].isSolid;
				}
				position.x += 1;
			}
			position.y += 1;
		}

		var meshes = [],
		centerOfWall,
		thinUpWall,
		thinRightWall,
		thinDownWall,
		thinLeftWall;

		var material = new THREE.MeshPhongMaterial({color : 0x3344ff});

		centerOfWall = new THREE.Mesh(middleOfWallGeometry, material);
		meshes.push(centerOfWall);

		if (wallMatrix[2][1]) {
			thinUpWall = new THREE.Mesh(thinUpWallGeometry, material);
			thinUpWall.position.y = 0.3 * step;
			meshes.push(thinUpWall);
		}

		if (wallMatrix[1][2]) {
			thinRightWall = new THREE.Mesh(thinRightWallGeometry, material);
			thinRightWall.position.x = 0.3 * step;
			meshes.push(thinRightWall);
		}

		if (wallMatrix[0][1]) {
			thinDownWall = new THREE.Mesh(thinDownWallGeometry, material);
			thinDownWall.position.y = - 0.3 * step;
			meshes.push(thinDownWall);
		}

		if (wallMatrix[1][0]) {
			thinLeftWall = new THREE.Mesh(thinLeftWallGeometry, material);
			thinLeftWall.position.x = - 0.3 * step;
			meshes.push(thinLeftWall);
		}

		for (var i = 0; i < meshes.length; i++) {
			meshes[i].updateMatrix();
			currentWall.merge(meshes[i].geometry, meshes[i].matrix);
		}

		return new THREE.Mesh(currentWall, new THREE.MeshPhongMaterial({
			color : util.tileTypes[0].color
			// ,
			// map   : tileTexture
		}));
	}

}

export { Game };
