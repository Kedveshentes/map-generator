import * as THREE from 'three';

import { util, step } from './util';
import { Player } from './player';
import { worldInstance } from './world';
import { Wall } from './wall';

var geometry = new THREE.BoxGeometry(1 * step, 1 * step, 1 * step);
var cubeFactory = function (cubeType) {
	return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
		color : util.tileTypes[cubeType].color
		// ,
		// map   : tileTexture
	}));
}

class Game {
	constructor (labyrinth) {
		this.labyrinth = labyrinth;
		this.world = worldInstance(this.labyrinth);
		this.raycaster = new THREE.Raycaster();
		this.player = new Player();

		this.map3d = [];

		document.body.appendChild(this.world.renderer.domElement);

		this.start();
	}

	start() {
		this.render();
		this.draw();
	}

	render () {
		requestAnimationFrame(() => {
			this.render();
		});

		this.update();
		this.world.render();
	}

	update () {
		let intersects = this.raycaster.intersectObjects([this.world.gameField]);

		this.raycaster.setFromCamera(this.player.mouse, this.world.camera);
		this.player.update(intersects);
		if (intersects.length) {
			this.world.camera.position.x = this.player.mesh.position.x;
			this.world.camera.position.y = this.player.mesh.position.y;
			// this.player.mesh.lookAt(intersects[0].point);
		}
		this.world.camera.lookAt(this.player.mesh.position);
		// this.spotLight.position.set(-30, this.labyrinth.height / 1.5, 60 * step);
	}

	draw () {
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

					wall = new Wall(this.labyrinth.map, x, y);

					wall.castShadow = true;
					wall.receiveShadow = true;
					wall.position.set(x * step, y * step, 1 * step);

					wall.updateMatrix();
					wallsGeometry.merge(wall.geometry, wall.matrix);
				}
				cube.receiveShadow = true;
				cube.position.set(x * step, y * step, -0.5 * step);
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
}

export { Game };
