'use strict';

export default class Skybox extends BABYLON.Mesh.CreateBox {
  constructor(scene) {
    super(scene.name + " Skybox", 4000.0, scene);

    this.material = new BABYLON.StandardMaterial("skyBox", scene);
    this.material.backFaceCulling = false;
    this.material.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skyboxes/skybox-1/skybox-1", scene);
    this.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.material.specularColor = new BABYLON.Color3(0, 0, 0);
    this.material.disableLighting = true;
  }
}
