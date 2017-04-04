'use strict';
import SolarSystem from "./components/solar_system.js";

(() => {
  class Galaxy extends BABYLON.Engine {
    constructor(canvas, user) {
      super(canvas, true);

      this.user = user;
      this.canvas = canvas;
      this.scene = this.genSystem();
    }

    init() {
      console.log('Let there be light.');

      var engine = this;

      this.runRenderLoop(function () {
        engine.scene.render();
      });

      window.addEventListener("resize", function () {
        engine.resize();
      });
    }

    genSystem() {
      return new SolarSystem(
        this,
        'Sol',
        {
          planets: [
            { moons: [{ r: {x: 1, z: 1} }, { r: {x: 1, z: 1} }] },
            { moons: [{ r: {x: 1, z: 1} }] },
            { moons: [{ r: {x: 1, z: 1} }, { r: {x: 1, z: 1} }, { r: {x: 1, z: 1} }, { r: {x: 1, z: 1} }] }
          ]
        }
      );
    }
  }

  const canvas = document.getElementById("renderCanvas");
  const app =  new Galaxy(canvas, {});

  app.init();
})()