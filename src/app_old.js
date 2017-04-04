import SolarSystem from "./components/solar_system.js";
import Camera from "./components/camera.js";

(() => {
  const canvas = document.getElementById("renderCanvas");
  window.canvas = canvas;
  const engine = new BABYLON.Engine(canvas, true);
  window.engine = engine;

  const genSystem = (engine) => {
    return new SolarSystem(
      engine,
      'Sol',
      {
        planets: [
          { moons: [{}, {}] },
          { moons: [{}] },
          { moons: [{}, {}, {}, {}] }
        ]
      }
    );
  }

  window.genSystem = genSystem;
  window.user = {};

  const drawOrbit = (radius, scene) => {
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

    let line = BABYLON.Mesh.CreateLines("circle", path, scene);
    line.color = new BABYLON.Color3(0.3, 0, 0);

    return line;
  }

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    window.scene = scene;
    // Camera
    var camera = new Camera(scene, canvas);
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    // camera.setPosition(new BABYLON.Vector3(-10, 10, 0));
    // camera.attachControl(canvas, true);
    // camera.radius = 300;
    // camera.lowerRadiusLimit = 10;
    // camera.upperRadiusLimit = 800;
    window.camera = camera;

    // Lights
    var sunlight = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 0), scene);
    var sunrays = new BABYLON.VolumetricLightScatteringPostProcess('sunrays', 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    sunrays.mesh.material.diffuseTexture = new BABYLON.Texture('assets/textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    sunrays.mesh.material.diffuseTexture.hasAlpha = true;
    sunrays.mesh.position = new BABYLON.Vector3(0, 0, 0);
    sunrays.mesh.scaling = new BABYLON.Vector3(40, 40, 40);
    sunrays.mesh.actionManager = new BABYLON.ActionManager(scene);

    sunlight.position = sunrays.mesh.position;

    // Planets
    var p1 = BABYLON.Mesh.CreateSphere("Sphere", 16, 4, scene);
    p1.position = new BABYLON.Vector3(1000, 500, 0);
    p1.scaling = new BABYLON.Vector3(1, 1, 1);
    p1.actionManager = new BABYLON.ActionManager(scene);
    p1.orbit = drawOrbit(100, scene);

    var p2 = BABYLON.Mesh.CreateSphere("Sphere", 16, 4, scene);
    p2.position = new BABYLON.Vector3(1000, 500, 0);
    p2.scaling = new BABYLON.Vector3(1, 1, 1);
    p2.actionManager = new BABYLON.ActionManager(scene);
    p2.orbit = drawOrbit(200, scene);

    var p3 = BABYLON.Mesh.CreateSphere("Sphere", 16, 4, scene);
    p3.position = new BABYLON.Vector3(1000, 500, 0);
    p3.scaling = new BABYLON.Vector3(1, 1, 1);
    p3.actionManager = new BABYLON.ActionManager(scene);
    p3.orbit = drawOrbit(300, scene);

    var p4 = BABYLON.Mesh.CreateSphere("Sphere", 16, 4, scene);
    p4.position = new BABYLON.Vector3(1000, 500, 0);
    p4.scaling = new BABYLON.Vector3(1, 1, 1);
    p4.actionManager = new BABYLON.ActionManager(scene);
    p4.orbit = drawOrbit(400, scene);

    // Moons
    var moon0 = BABYLON.Mesh.CreateSphere("Sphere0", 16, 0.5, scene);
    var moon1 = BABYLON.Mesh.CreateSphere("Sphere1", 16, 0.5, scene);
    var moon2 = BABYLON.Mesh.CreateSphere("Sphere2", 16, 0.5, scene);

    var material = new BABYLON.StandardMaterial("surface", scene);

    material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    moon0.material = material;
    moon1.material = material;
    moon2.material = material;

    // Planet material
    var planetMaterial = new BABYLON.StandardMaterial("sun", scene);
    planetMaterial.diffuseTexture = new BABYLON.Texture('assets/textures/sunmap.jpg', scene);
    p1.material = planetMaterial;
    p2.material = planetMaterial;
    p3.material = planetMaterial;
    p4.material = planetMaterial;

    // Lights colors
    sunlight.diffuse = new BABYLON.Color3(1, 1, 1);
    sunlight.specular = new BABYLON.Color3(1, 1, 1);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skyboxes/skybox-1/skybox-1", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Interaction
    user.target = sunrays.mesh;
    var makeOverOut = function(mesh) {
      mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
      mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));
      mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
      mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
    }

    makeOverOut(p1);

    var targetOnClick = function(mesh) {
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => { user.target = mesh }
        )
      );
    }

    targetOnClick(p1);
    targetOnClick(sunrays.mesh);

    // Shadows
    // var shadowGenerator = new BABYLON.ShadowGenerator(1024, sunlight);
    // shadowGenerator.getShadowMap().renderList.push(moon0);
    // shadowGenerator.getShadowMap().renderList.push(moon1);
    // shadowGenerator.getShadowMap().renderList.push(moon2);
    // shadowGenerator.useBlurVarianceShadowMap = true;
    // shadowGenerator.blurBoxOffset = 2.0;
    // p1.receiveShadows = true;
    // p2.receiveShadows = true;
    // p3.receiveShadows = true;
    // p4.receiveShadows = true;

    // Animations
    var planet1Alpha = 0,
      planet2Alpha = 1000,
      planet3Alpha = 500,
      planet4Alpha = 1500,
      p1last,
      moon0Alpha = 0,
      moon1Alpha = 30,
      moon2Alpha = 60;
    scene.beforeRender = function () {
      p1.position = new BABYLON.Vector3(
        100 * Math.sin(planet1Alpha),
        0,
        100 * Math.cos(planet1Alpha)
      );
      if (p1last) {

      }
      p2.position = new BABYLON.Vector3(
        200 * Math.sin(planet2Alpha),
        0,
        200 * Math.cos(planet2Alpha)
      );
      p3.position = new BABYLON.Vector3(
        300 * Math.sin(planet3Alpha),
        0,
        300 * Math.cos(planet3Alpha)
      );
      p4.position = new BABYLON.Vector3(
        400 * Math.sin(planet4Alpha),
        0,
        400 * Math.cos(planet4Alpha)
      );

      moon0.position = new BABYLON.Vector3(
        5 * Math.sin(moon0Alpha) + p1.position.x,
        0,
        5 * Math.cos(moon0Alpha) + p1.position.z
      );
      moon1.position = new BABYLON.Vector3(
        8 * Math.sin(moon1Alpha) + p1.position.x,
        0,
        8 * Math.cos(moon1Alpha) + p1.position.z
      );
      moon2.position = new BABYLON.Vector3(
        13 * Math.sin(moon2Alpha) + p1.position.x,
        0,
        13 * Math.cos(moon2Alpha) + p1.position.z
      );

      camera.target = user.target.position;

      planet1Alpha += 0.001;
      planet2Alpha += 0.0005;
      planet3Alpha += 0.0001;
      planet4Alpha += 0.00005;
      moon0Alpha += 0.008;
      moon1Alpha += 0.005;
      moon2Alpha += 0.002;
    };

    return scene;
  }

  var scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  // Resize
  window.addEventListener("resize", function () {
      engine.resize();
  });
})()
