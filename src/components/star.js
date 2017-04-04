'use strict';

export default class Star extends BABYLON.PointLight {
  constructor(scene, engine, name, attrs) {
    super(name, new BABYLON.Vector3(0, 0, 0), scene);

    this.rays = new BABYLON.VolumetricLightScatteringPostProcess('sunrays', 1.0, scene.camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false );
    this.rays.mesh.material.diffuseTexture = new BABYLON.Texture('assets/textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    this.rays.mesh.material.diffuseTexture.hasAlpha = true;
    this.rays.mesh.position = new BABYLON.Vector3(0, 0, 0);
    this.rays.mesh.scaling = new BABYLON.Vector3(40, 40, 40);
    this.rays.mesh.actionManager = new BABYLON.ActionManager(scene);
    scene.target = this.rays.mesh;

    this.position = this.rays.mesh.position;
    this.diffuse = new BABYLON.Color3(1, 1, 1);
    this.specular = new BABYLON.Color3(1, 1, 1);

    this.beforeRender = () => { }
  }
}
