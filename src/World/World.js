import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from './systems/Loop.js';
import { createRobot } from "./components/robot.js";

let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const robot = createRobot();

    const light = createLights();

    loop.updatables.push(robot);


    scene.add(robot, light);

    const resizer = new Resizer(container, camera, renderer);

    // Set up control panel
    this.setupControls(robot);
  }

  setupControls(robot) {
    const btnAuto = document.getElementById('btn-auto');
    const btnManual = document.getElementById('btn-manual');
    const manualControls = document.getElementById('manual-controls');
    const jointSelector = document.getElementById('joint-selector');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    // Mode switch handlers
    btnAuto.addEventListener('click', () => {
      robot.mode = 'auto';
      btnAuto.classList.add('active');
      btnManual.classList.remove('active');
      manualControls.classList.add('hidden');
    });

    btnManual.addEventListener('click', () => {
      robot.mode = 'manual';
      btnManual.classList.add('active');
      btnAuto.classList.remove('active');
      manualControls.classList.remove('hidden');
    });

    // Arrow button handlers
    btnLeft.addEventListener('click', () => {
      const selectedJoint = jointSelector.value;
      robot.rotateJoint(selectedJoint, -1); // Rotate left (negative direction)
    });

    btnRight.addEventListener('click', () => {
      const selectedJoint = jointSelector.value;
      robot.rotateJoint(selectedJoint, 1); // Rotate right (positive direction)
    });
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
