'use strict';
import Skybox from "./skybox.js";
import Star from "./star.js";
import Planet from "./planet.js";
import Camera from "./camera.js";

export default class SolarSystem extends BABYLON.Scene {
  constructor(engine, name, attrs) {
    super(engine);

    this.name = name;
    this.attrs = attrs;

    this.skybox = new Skybox(this);
    this.camera = new Camera(this, engine.canvas);
    this.star = new Star(this, engine, name, attrs.star);
    this.planets = this.genPlanets(attrs.planets);

    this.beforeRender = () => {
      this.star.beforeRender();
      this.planets.forEach( planet => planet.beforeRender() );
      this.camera.beforeRender();

      return this;
    }
  }


  genPlanets(attrs) {
    let planets = [];

    for (let i = 0; i < attrs.length; i++) {
      planets.push(new Planet(this, `${this.name}-${this.roman(i)}`, attrs[i], i));
    }

    return planets;
  }

  roman(i) {
    var romap = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    return romap[i];
  }
}
