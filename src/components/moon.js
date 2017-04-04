'use strict';

export default class Moon extends BABYLON.Mesh {
  constructor(scene, planet, name, attrs, i) {
    super(name, scene);

    this.order = i + 1;
    this.planet = planet;

    let options = {
      segments: 16,
      diameterX: 0.5,
      diameterY: 0.5,
      diameterZ: 0.5,
      sideOrientation: BABYLON.MeshBuilder.updateSideOrientation(null, scene)
    }

    let vertexData = BABYLON.VertexData.CreateSphere(options);
    vertexData.applyToMesh(this, true);

    this.position = new BABYLON.Vector3(1000, 500, 0);
    this.scaling = new BABYLON.Vector3(1, 1, 1);
    this.actionManager = new BABYLON.ActionManager(scene);
    this.alpha = this.order * 40;

    this.material = new BABYLON.StandardMaterial(name + "_material", scene, 512);
    this.material.diffuseTexture = new BABYLON.Texture('assets/textures/moon1.jpg', scene);
    this.material.diffuseTexture.uScale = 1;
    this.material.diffuseTexture.vScale = 1;
    this.material.specularColor = new BABYLON.Color3(0, 0, 0);

    this.beforeRender = () => {
      let x = attrs.r.x ? ((1.5 + this.order * 2.5) * Math.sin(this.alpha)) : 0;
      let y = attrs.r.y ? ((1.5 + this.order * 2.5) * Math.cos(this.alpha)) : 0;
      let z = attrs.r.z ? ((1.5 + this.order * 2.5) * Math.cos(this.alpha)) : 0;

      this.position = new BABYLON.Vector3(
        x + this.planet.position.x,
        y + this.planet.position.y,
        z + this.planet.position.z
      );

      this.alpha += (0.005 / this.order);
    }
  }
}
