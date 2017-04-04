'use strict';
import Moon from './moon.js';
import TargetCamera from "../actions/target_camera.js";

export default class Planet extends BABYLON.Mesh {
  constructor(scene, name, attrs, i) {
    super(name, scene);

    this.order = i + 1;
    this.scene = scene;

    let options = {
      segments: 16,
      diameterX: 4,
      diameterY: 4,
      diameterZ: 4,
      sideOrientation: BABYLON.MeshBuilder.updateSideOrientation(null, scene)
    }

    let vertexData = BABYLON.VertexData.CreateSphere(options);
    vertexData.applyToMesh(this, true);

    this.position = new BABYLON.Vector3(1000, 500, 0);
    this.scaling = new BABYLON.Vector3(1, 1, 1);
    this.orbit = this.drawOrbit(100 * this.order, scene);
    this.alpha = this.order * Math.random() * 500;

    this.actionManager = new BABYLON.ActionManager(scene);
    this.actionManager.registerAction(TargetCamera(scene, this));

    this.material = new BABYLON.StandardMaterial(name + "_material", scene, 512);
    this.material.diffuseTexture = new BABYLON.Texture('assets/textures/moon1.jpg', scene);
    this.material.diffuseTexture.uScale = 1;
    this.material.diffuseTexture.vScale = 1;
    this.material.specularColor = new BABYLON.Color3(0, 0, 0);

    this.moons = this.genMoons(scene, attrs.moons);

    this.beforeRender = () => {
      this.position = new BABYLON.Vector3(
        this.order * 100 * Math.sin(this.alpha),
        0,
        this.order * 100 * Math.cos(this.alpha)
      );
      this.alpha += 0.001 / this.order;

      this.rotation  = new BABYLON.Vector3(
        this.rotation.x + 0,
        this.rotation.y + 0.001,
        this.rotation.z + 0
      );

      this.moons.forEach( moon => moon.beforeRender() );
    }
  }

  drawOrbit(radius, scene) {
    var tes = 120;
    var pi2 = Math.PI * 2;
    var step = pi2 / tes;
    var path = [];
    for (var i = 0; i < pi2; i += step ) {
      var x = radius * Math.sin(i);
      var z = radius * Math.cos(i);
      var y = 0;
      path.push( new BABYLON.Vector3(x, y, z) );
    }
    path.push(path[0]);

    var line = BABYLON.Mesh.CreateLines("circle", path, scene);
    line.color = new BABYLON.Color3(0.3, 0, 0);

    return line;
  }

  genMoons(scene, attrs) {
    let moons = [];

    for (let i = 0; i < attrs.length; i++) {
      moons.push(new Moon(this.scene, this, name + '_moon_' + i, attrs[i], i));
    }

    return moons;
  }
}
