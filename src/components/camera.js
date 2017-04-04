'use strict';

export default class Camera extends BABYLON.ArcRotateCamera {
  constructor(scene, canvas) {
    super("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

    this.setPosition(new BABYLON.Vector3(-10, 10, 0));
    this.attachControl(canvas, true);
    this.radius = 300;
    this.lowerRadiusLimit = 10;
    this.upperRadiusLimit = 800;

    this.beforeRender = () => {
      this.target = scene.target.position;
    }
  }
}
