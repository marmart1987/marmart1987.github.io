import config from "./config.js";

export function controlsManager(player, dt) {
    const acceleration = config.movementAcceleration; // Adjust this value as needed
    const velocity = player.rigidBody.velocity;
    player.limitMaxSpeed()
    if (player.isMovingLeft) {
        Matter.Body.setVelocity(player.rigidBody, {
            x: velocity.x - acceleration * dt,
            y: velocity.y
        });
    }
    if (player.isMovingRight) {
        Matter.Body.setVelocity(player.rigidBody, {
            x: velocity.x + acceleration * dt,
            y: velocity.y
        });
    }

    player.limitMaxSpeed()
}