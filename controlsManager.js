export function controlsManager(player, dt) {
    const acceleration = 0.9; // Adjust this value as needed
    const velocity = player.rigidBody.velocity;
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
}