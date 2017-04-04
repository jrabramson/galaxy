'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Skybox = function (_BABYLON$Mesh$CreateB) {
  inherits(Skybox, _BABYLON$Mesh$CreateB);

  function Skybox(scene) {
    classCallCheck(this, Skybox);

    var _this = possibleConstructorReturn(this, (Skybox.__proto__ || Object.getPrototypeOf(Skybox)).call(this, scene.name + " Skybox", 4000.0, scene));

    _this.material = new BABYLON.StandardMaterial("skyBox", scene);
    _this.material.backFaceCulling = false;
    _this.material.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skyboxes/skybox-1/skybox-1", scene);
    _this.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    _this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    _this.material.specularColor = new BABYLON.Color3(0, 0, 0);
    _this.material.disableLighting = true;
    return _this;
  }

  return Skybox;
}(BABYLON.Mesh.CreateBox);

var Star = function (_BABYLON$PointLight) {
  inherits(Star, _BABYLON$PointLight);

  function Star(scene, engine, name, attrs) {
    classCallCheck(this, Star);

    var _this = possibleConstructorReturn(this, (Star.__proto__ || Object.getPrototypeOf(Star)).call(this, name, new BABYLON.Vector3(0, 0, 0), scene));

    _this.rays = new BABYLON.VolumetricLightScatteringPostProcess('sunrays', 1.0, scene.camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    _this.rays.mesh.material.diffuseTexture = new BABYLON.Texture('assets/textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    _this.rays.mesh.material.diffuseTexture.hasAlpha = true;
    _this.rays.mesh.position = new BABYLON.Vector3(0, 0, 0);
    _this.rays.mesh.scaling = new BABYLON.Vector3(40, 40, 40);
    _this.rays.mesh.actionManager = new BABYLON.ActionManager(scene);
    scene.target = _this.rays.mesh;

    _this.position = _this.rays.mesh.position;
    _this.diffuse = new BABYLON.Color3(1, 1, 1);
    _this.specular = new BABYLON.Color3(1, 1, 1);

    _this.beforeRender = function () {};
    return _this;
  }

  return Star;
}(BABYLON.PointLight);

var Moon = function (_BABYLON$Mesh) {
  inherits(Moon, _BABYLON$Mesh);

  function Moon(scene, planet, name, attrs, i) {
    classCallCheck(this, Moon);

    var _this = possibleConstructorReturn(this, (Moon.__proto__ || Object.getPrototypeOf(Moon)).call(this, name, scene));

    _this.order = i + 1;
    _this.planet = planet;

    var options = {
      segments: 16,
      diameterX: 0.5,
      diameterY: 0.5,
      diameterZ: 0.5,
      sideOrientation: BABYLON.MeshBuilder.updateSideOrientation(null, scene)
    };

    var vertexData = BABYLON.VertexData.CreateSphere(options);
    vertexData.applyToMesh(_this, true);

    _this.position = new BABYLON.Vector3(1000, 500, 0);
    _this.scaling = new BABYLON.Vector3(1, 1, 1);
    _this.actionManager = new BABYLON.ActionManager(scene);
    _this.alpha = _this.order * 40;

    _this.material = new BABYLON.StandardMaterial(name + "_material", scene, 512);
    _this.material.diffuseTexture = new BABYLON.Texture('assets/textures/moon1.jpg', scene);
    _this.material.diffuseTexture.uScale = 1;
    _this.material.diffuseTexture.vScale = 1;
    _this.material.specularColor = new BABYLON.Color3(0, 0, 0);

    _this.beforeRender = function () {
      var x = attrs.r.x ? (1.5 + _this.order * 2.5) * Math.sin(_this.alpha) : 0;
      var y = attrs.r.y ? (1.5 + _this.order * 2.5) * Math.cos(_this.alpha) : 0;
      var z = attrs.r.z ? (1.5 + _this.order * 2.5) * Math.cos(_this.alpha) : 0;

      _this.position = new BABYLON.Vector3(x + _this.planet.position.x, y + _this.planet.position.y, z + _this.planet.position.z);

      _this.alpha += 0.005 / _this.order;
    };
    return _this;
  }

  return Moon;
}(BABYLON.Mesh);

function TargetCamera(scene, mesh) {
  return new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
    scene.target = mesh;
  });
}

var Planet = function (_BABYLON$Mesh) {
  inherits(Planet, _BABYLON$Mesh);

  function Planet(scene, name, attrs, i) {
    classCallCheck(this, Planet);

    var _this = possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).call(this, name, scene));

    _this.order = i + 1;
    _this.scene = scene;

    var options = {
      segments: 16,
      diameterX: 4,
      diameterY: 4,
      diameterZ: 4,
      sideOrientation: BABYLON.MeshBuilder.updateSideOrientation(null, scene)
    };

    var vertexData = BABYLON.VertexData.CreateSphere(options);
    vertexData.applyToMesh(_this, true);

    _this.position = new BABYLON.Vector3(1000, 500, 0);
    _this.scaling = new BABYLON.Vector3(1, 1, 1);
    _this.orbit = _this.drawOrbit(100 * _this.order, scene);
    _this.alpha = _this.order * Math.random() * 500;

    _this.actionManager = new BABYLON.ActionManager(scene);
    _this.actionManager.registerAction(TargetCamera(scene, _this));

    _this.material = new BABYLON.StandardMaterial(name + "_material", scene, 512);
    _this.material.diffuseTexture = new BABYLON.Texture('assets/textures/moon1.jpg', scene);
    _this.material.diffuseTexture.uScale = 1;
    _this.material.diffuseTexture.vScale = 1;
    _this.material.specularColor = new BABYLON.Color3(0, 0, 0);

    _this.moons = _this.genMoons(scene, attrs.moons);

    _this.beforeRender = function () {
      _this.position = new BABYLON.Vector3(_this.order * 100 * Math.sin(_this.alpha), 0, _this.order * 100 * Math.cos(_this.alpha));
      _this.alpha += 0.001 / _this.order;

      _this.rotation = new BABYLON.Vector3(_this.rotation.x + 0, _this.rotation.y + 0.001, _this.rotation.z + 0);

      _this.moons.forEach(function (moon) {
        return moon.beforeRender();
      });
    };
    return _this;
  }

  createClass(Planet, [{
    key: 'drawOrbit',
    value: function drawOrbit(radius, scene) {
      var tes = 120;
      var pi2 = Math.PI * 2;
      var step = pi2 / tes;
      var path = [];
      for (var i = 0; i < pi2; i += step) {
        var x = radius * Math.sin(i);
        var z = radius * Math.cos(i);
        var y = 0;
        path.push(new BABYLON.Vector3(x, y, z));
      }
      path.push(path[0]);

      var line = BABYLON.Mesh.CreateLines("circle", path, scene);
      line.color = new BABYLON.Color3(0.3, 0, 0);

      return line;
    }
  }, {
    key: 'genMoons',
    value: function genMoons(scene, attrs) {
      var moons = [];

      for (var i = 0; i < attrs.length; i++) {
        moons.push(new Moon(this.scene, this, name + '_moon_' + i, attrs[i], i));
      }

      return moons;
    }
  }]);
  return Planet;
}(BABYLON.Mesh);

var Camera = function (_BABYLON$ArcRotateCam) {
  inherits(Camera, _BABYLON$ArcRotateCam);

  function Camera(scene, canvas) {
    classCallCheck(this, Camera);

    var _this = possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this, "Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene));

    _this.setPosition(new BABYLON.Vector3(-10, 10, 0));
    _this.attachControl(canvas, true);
    _this.radius = 300;
    _this.lowerRadiusLimit = 10;
    _this.upperRadiusLimit = 800;

    _this.beforeRender = function () {
      _this.target = scene.target.position;
    };
    return _this;
  }

  return Camera;
}(BABYLON.ArcRotateCamera);

var SolarSystem = function (_BABYLON$Scene) {
  inherits(SolarSystem, _BABYLON$Scene);

  function SolarSystem(engine, name, attrs) {
    classCallCheck(this, SolarSystem);

    var _this = possibleConstructorReturn(this, (SolarSystem.__proto__ || Object.getPrototypeOf(SolarSystem)).call(this, engine));

    _this.name = name;
    _this.attrs = attrs;

    _this.skybox = new Skybox(_this);
    _this.camera = new Camera(_this, engine.canvas);
    _this.star = new Star(_this, engine, name, attrs.star);
    _this.planets = _this.genPlanets(attrs.planets);

    _this.beforeRender = function () {
      _this.star.beforeRender();
      _this.planets.forEach(function (planet) {
        return planet.beforeRender();
      });
      _this.camera.beforeRender();

      return _this;
    };
    return _this;
  }

  createClass(SolarSystem, [{
    key: "genPlanets",
    value: function genPlanets(attrs) {
      var planets = [];

      for (var i = 0; i < attrs.length; i++) {
        planets.push(new Planet(this, this.name + "-" + this.roman(i), attrs[i], i));
      }

      return planets;
    }
  }, {
    key: "roman",
    value: function roman(i) {
      var romap = ['I', 'II', 'III', 'IV', 'V', 'VI'];

      return romap[i];
    }
  }]);
  return SolarSystem;
}(BABYLON.Scene);

(function () {
  var Galaxy = function (_BABYLON$Engine) {
    inherits(Galaxy, _BABYLON$Engine);

    function Galaxy(canvas, user) {
      classCallCheck(this, Galaxy);

      var _this = possibleConstructorReturn(this, (Galaxy.__proto__ || Object.getPrototypeOf(Galaxy)).call(this, canvas, true));

      _this.user = user;
      _this.canvas = canvas;
      _this.scene = _this.genSystem();
      return _this;
    }

    createClass(Galaxy, [{
      key: 'init',
      value: function init() {
        console.log('Let there be light.');

        var engine = this;

        this.runRenderLoop(function () {
          engine.scene.render();
        });

        window.addEventListener("resize", function () {
          engine.resize();
        });
      }
    }, {
      key: 'genSystem',
      value: function genSystem() {
        return new SolarSystem(this, 'Sol', {
          planets: [{ moons: [{ r: { x: 1, z: 1 } }, { r: { x: 1, z: 1 } }] }, { moons: [{ r: { x: 1, z: 1 } }] }, { moons: [{ r: { x: 1, z: 1 } }, { r: { x: 1, z: 1 } }, { r: { x: 1, z: 1 } }, { r: { x: 1, z: 1 } }] }]
        });
      }
    }]);
    return Galaxy;
  }(BABYLON.Engine);

  var canvas = document.getElementById("renderCanvas");
  var app = new Galaxy(canvas, {});

  app.init();
})();
