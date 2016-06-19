import * as THREE from 'three';
import { step } from '../util';

export class Player {
	constructor(world) {
		this.world = world;

		this.velocity = 0.05 * step;

		this.geometry = new THREE.BoxGeometry(0.3 * step, 0.3 * step, 0.3 * step);

		this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
			color : '#3b2ed5'
		}));
		this.mesh.position.set(10 * step, 10 * step, 0.15 * step);
		this.world.scene.add(this.mesh);

		this.aura = new THREE.PointLight(0xffffff, 0.2, 2 * step);
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

		this.flashLightHelper = new THREE.SpotLightHelper(this.flashLight);
		// this.world.scene.add(this.flashLightHelper);
	}
}
