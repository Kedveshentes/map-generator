import * as THREE from 'three';
import { step, canvas } from '../util';

export class World {
	constructor(labyrinth) {
		this.scene = new THREE.Scene();

		this.gameFieldGeometry = new THREE.PlaneGeometry((labyrinth.width + 1) * step, (labyrinth.height + 1) * step, 1 * step);
		this.gameFieldMaterial = new THREE.MeshPhongMaterial({color : 0x9FCFEF});
		this.gameField = new THREE.Mesh(this.gameFieldGeometry, this.gameFieldMaterial);
		this.gameField.position.set(10 * step, 10 * step, 0);
		this.gameField.castShadow = true;
		this.gameField.receiveShadow = true;

		this.scene.add(this.gameField);

		this.camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 1000);
		this.camera.position.set(10 * step, 10 * step, 7 * step);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(canvas.width, canvas.height);
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;

		// this.light = new THREE.AmbientLight(0x666666);
		// this.scene.add(this.light);

		this.spotLight = new THREE.SpotLight(0xaaaaaa);
		this.spotLight.castShadow = true;
		this.spotLight.shadow.darkness = 0.5;
		this.spotLight.shadow.mapSize.width = 1024;
		this.spotLight.shadow.mapSize.height = 1024;
		this.spotLight.shadow.camera.near = 5;
		this.spotLight.shadow.camera.far = 2000;
		this.spotLight.shadow.camera.fov = 120;
		this.spotLight.shadow.camera.visible = true;
		// this.scene.add(this.spotLight);
	}

	render () {
		this.renderer.render(this.scene, this.camera);
	}
}
