import * as THREE from 'three';
import { step, canvas } from '../util';
// import { Projectile } from '../projectile';
import { worldInstance } from '../world';

export class Player {
	constructor() {
		this.world = worldInstance();

		this.velocity = 0.05 * step;

		this.mouse = new THREE.Vector2();

		this.geometry = new THREE.BoxGeometry(0.3 * step, 0.3 * step, 0.3 * step);

		this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
			color : '#3b2ed5'
		}));
		this.mesh.position.set(10 * step, 10 * step, 0.15 * step);
		this.world.scene.add(this.mesh);

		this.aura = new THREE.PointLight(0xffffff, 0.1, 20 * step);
		this.aura.castShadow = true;
		this.world.scene.add(this.aura);

		this.flashLight = new THREE.SpotLight(0xffffff);
		this.flashLight.intensity = 2.0;
		this.flashLight.distance = 6 * step;
		this.flashLight.angle = Math.PI/180 * 40;
		this.flashLight.decay = 1;
		this.flashLight.castShadow = true;
		this.flashLight.shadow.darkness = 1.0;
		this.flashLight.shadow.mapSize.width  = 1024;
		this.flashLight.shadow.mapSize.height = 1024;
		// this.flashLight.shadow.bias = 0.0001;
		// this.flashLight.shadow.camera.near = 0.1;
		// this.flashLight.shadow.camera.far = 10;
		// this.flashLight.shadow.camera.fov = Math.PI/180 * 40;
		this.flashLight.penumbra = 0.1;
		this.world.scene.add(this.flashLight);
		this.world.scene.add(this.flashLight.target);

		// console.log(this.flashLight.target);

		this.flashLightHelper = new THREE.SpotLightHelper(this.flashLight);
		// this.world.scene.add(this.flashLightHelper);

		// this.flashLightTarget = new THREE.Object3D();
		// this.world.scene.add(this.flashLightTarget);

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
		}

		document.onmousemove = onmousemove;
		document.onkeyup = handleKeyUp;
		document.onkeydown = handleKeyDown;
	}

	move () {
		if (this.pressedKeys[87]) {
			// Up cursor key
			this.mesh.position.y += this.velocity;
		}
		if (this.pressedKeys[65]) {
			// Left cursor key
			this.mesh.position.x -= this.velocity;
		}
		if (this.pressedKeys[83]) {
			// Down cursor key
			this.mesh.position.y -= this.velocity;
		}
		if (this.pressedKeys[68]) {
			// Right cursor key
			this.mesh.position.x += this.velocity;
		}
	};

	update (intersects) {
		this.move();
		this.flashLight.position.set(this.mesh.position.x, this.mesh.position.y, 0.4 * step);
		this.flashLightHelper.update();
		this.aura.position.set(this.mesh.position.x, this.mesh.position.y, 0.4 * step);

		if (intersects.length) {
			this.flashLight.target.position.set(
				intersects[0].point.x,
				intersects[0].point.y,
				1
			);
		}
	}

	shoot () {
		// let projectile = new Projectile();
	}
}
