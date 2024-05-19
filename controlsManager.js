import config from "./config.js";

export function controlsManager(player, dt) {
    if (!player) return;
    const acceleration = config.movementAcceleration
    const vel = player.rigidBody.velocity;
    console.log(vel, acceleration)
    if (player.isMovingLeft) {
        vel.x -= acceleration * dt;
    } else if (player.isMovingRight) {
        vel.x += acceleration * dt;
    }
    Matter.Body.setVelocity(player.rigidBody, vel);
    player.limitMaxSpeed();
}