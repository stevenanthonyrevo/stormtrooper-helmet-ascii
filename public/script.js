var container;
var camera, controls, scene, renderer;
var start = Date.now();
var glbModel;
var asciiEffect; // Declare asciiEffect globally

init();
animate();

function init() {
  var width = window.innerWidth || 2;
  var height = window.innerHeight || 2;
  container = document.createElement('div');
  document.body.appendChild(container);
  var info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = 'Drag to change the view';
  container.appendChild(info);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, 55);

  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 5;
  controls.panSpeed = 2;

  scene = new THREE.Scene();

  var light = new THREE.PointLight(0xffffff);
  light.position.set(69500, 69500, 69500);
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffff, 0.25);
  light2.position.set(-29500, -29500, -29500);
  scene.add(light2);

  var dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('./');

  // Load the GLB model
  var loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  if (loader !== undefined) {
    loader.load(
      './star_wars_stormtrooper_helmet.glb',
      function (gltf) {
        glbModel = gltf.scene;
        scene.add(glbModel);
        // Adjust position to center the model
        const bbox = new THREE.Box3().setFromObject(glbModel);
        const center = bbox.getCenter(new THREE.Vector3());
        glbModel.position.sub(center);
      },
      undefined,
      function (error) {
        console.error('Error loading GLB model:', error);
      }
    );
  } else {
    console.error('GLTFLoader is undefined');
  }

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(width, height);

  // ASCII ShaderEffect
  asciiEffect = new THREE.AsciiEffect(renderer); // Initialize asciiEffect
  asciiEffect.setSize(width, height);
  container.appendChild(asciiEffect.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  asciiEffect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  controls.update();
  asciiEffect.render(scene, camera); // Apply the ASCII effect to the rendered scene
}
