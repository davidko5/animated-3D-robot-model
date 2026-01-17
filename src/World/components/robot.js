import {
    Mesh,
    MeshStandardMaterial,
    MeshPhysicalMaterial,
    MathUtils,
    CylinderGeometry
} from "three";

import { createArm } from "./arm.js";


function createRobot() {
    const baseGeometry = new CylinderGeometry(2, 2, 0.03, 32, 1, false, 0, 6.29);
    const material = new MeshStandardMaterial({ color: "dimgrey" });
    const standMaterial = new MeshStandardMaterial({ color: "grey" });


    const base = new Mesh(baseGeometry, material);

    const standGeometry = new CylinderGeometry(.3, .3, 2, 32, 1, false, 0, 6.29);
    const stand = new Mesh(standGeometry, standMaterial);
    stand.position.y = 1;

    const bodyGeometry = new CylinderGeometry(.3, .3, 2, 32, 1, false, 0, 6.29);
    const body = new Mesh(standGeometry, material);
    body.position.y = 3;

    const arm1 = createArm();
    const arm2 = createArm();
    arm1.position.z = 0.4;
    arm1.position.y += 0.6;
    // arm1.rotation.y = MathUtils.degToRad(90);

    arm2.rotation.set(0, 0, 0);
    arm2.position.x = -2;
    arm2.position.y = .2;

    arm1.add(arm2);
    body.add(arm1);
    const robot = base;
    robot.add(stand, body)

    // robot.rotation.y = MathUtils.degToRad(-70);
    // body.rotation.y = MathUtils.degToRad(105);
    const radiansPerSecond = MathUtils.degToRad(30);
    let flag1, flag2, flag3 = 0;

    // Mode control: 'auto' or 'manual'
    robot.mode = 'auto';

    // Expose joints for external control
    robot.joints = {
        body: body,
        arm1: arm1,
        arm2: arm2
    };

    // Manual rotation amount (degrees per click)
    const rotationStep = MathUtils.degToRad(10);

    // Method to rotate a joint manually
    robot.rotateJoint = (jointName, direction) => {
        const joint = robot.joints[jointName];
        if (joint) {
            joint.rotation.y += direction * rotationStep;
        }
    };

    robot.tick = (delta) => {
        // Only run automatic animation if in auto mode
        if (robot.mode !== 'auto') return;

        if (!flag1) {
            body.rotation.y += radiansPerSecond * delta;
            if (body.rotation.y > 6.28) flag1 = 1;
            // console.log(body.rotation.y);
        }
        if (flag1) {
            body.rotation.y -= radiansPerSecond * delta;
            if (body.rotation.y < 0) flag1 = 0;
            // console.log(body.rotation.y);
        }
        if (!flag2) {
            arm1.rotation.y += radiansPerSecond * delta;
            if (arm1.rotation.y > 9.42) flag2 = 1;
        }
        if (flag2) {
            arm1.rotation.y -= radiansPerSecond * delta;
            if (arm1.rotation.y < 3.14) flag2 = 0;
        }
        if (!flag3) {
            arm2.rotation.y -= radiansPerSecond * delta;
            if (arm2.rotation.y < 3.14) flag3 = 1;
        }
        if (flag3) {
            arm2.rotation.y += radiansPerSecond * delta;
            if (arm2.rotation.y > 9.42) flag3 = 0;
        }

        // arm2.rotation.y += radiansPerSecond * delta;

    };

    return robot;
}

export { createRobot };
