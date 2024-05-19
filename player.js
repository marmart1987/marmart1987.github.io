import {
    collidableSprite
} from "./collidableSprite.js";
import config from "./config.js";

/**
 * Checks if the player is colliding with the bottom of any object in the physics world.
 * @param {Matter.Body} playerObject - The player's rigid body.
 * @param {Matter.Engine} engine - The physics engine.
 * @returns {boolean} True if the player is colliding with the bottom of any object, false otherwise.
 */
function isBottomColliding(playerObject, engine) {
    /**
     * Iterate over all objects in the physics world, excluding the player.
     * If the player is colliding with the bottom of any object, return true.
     */
    const allObjects = Matter.Composite.allBodies(engine.world);
    return allObjects.some(object => {
        if (object !== playerObject) {
            /**
             * Get the collision information between the player and the current object.
             */
            const collisionInfo = Matter.Collision.collides(playerObject, object);
            if (!collisionInfo) {
                return false
            }

            /**
             * Check if the player is colliding with the bottom of the current object.
             * The player is colliding with the bottom if the player's y position is less
             * than the object's maximum y position, and the player's x position is
             * within the object's x range.
             */
            if (collisionInfo.collided && playerObject.bounds.max.y < object.bounds.max.y &&
                playerObject.position.x > object.bounds.min.x &&
                playerObject.position.x < object.bounds.max.x) {
                return true; // Player is standing on this object
            }
        }
    });
}


export class player extends collidableSprite {
    /**
     * The player class. Extends the CollidableSprite class.
     * @class
     * @param {PIXI.Texture} playerTexture - The texture used for the player sprite
     * @param {number} size - The size of the player sprite
     * @param {Matter.Engine} engine - The physics engine
     */
    constructor(playerTexture, size, engine) {
        super(playerTexture, size, size * 2, 200, 100, false, true)
        this.engine = engine
        this.isMovingLeft = false
        this.isMovingRight = false
        /**
         * Set the player's initial inertia to 1.5. This value determines how
         * much an object resists changes in its velocity.
         */
        Matter.Body.setInertia(this.rigidBody, 1.5)
        /**
         * Add event listeners for key down and key up events. These events are
         * handled in the keydownHandler and keyupHandler functions.
         */
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
        /**
         * The timestamp of the last time the player controller was updated.
         */
        this.lastControllerUpdate = Date.now()
        /**
         * The physical properties of the player. 
         */
        this.rigidBody.density = 0.001,
            this.rigidBody.friction = 0.3,
            this.rigidBody.frictionStatic = 0.0,
            this.rigidBody.frictionAir = 0.01,
            this.rigidBody.restitution = 0.4
    }
    limitMaxSpeed = () => {
        let maxSpeedX = config.maxXSpeed
        let maxSpeedY = config.maxYSpeed

        if (this.rigidBody.velocity.x > maxSpeedX) {
            Matter.Body.setVelocity(this.rigidBody, {
                x: maxSpeedX,
                y: this.rigidBody.velocity.y
            });
        }

        if (this.rigidBody.velocity.x < -maxSpeedX) {
            Matter.Body.setVelocity(this.rigidBody, {
                x: -maxSpeedX,
                y: this.rigidBody.velocity.y
            });
        }

        if (this.rigidBody.velocity.y > maxSpeedY) {
            Matter.Body.setVelocity(this.rigidBody, {
                x: this.rigidBody.velocity.x,
                y: maxSpeedY
            });
        }

        if (this.rigidBody.velocity.y < -maxSpeedY) {
            Matter.Body.setVelocity(this.rigidBody, {
                x: -this.rigidBody.velocity.x,
                y: -maxSpeedY
            });
        }

    }


    keyMap = {
        Space: 'jump',
        KeyW: 'jump',
        ArrowUp: 'jump',
        KeyA: 'left',
        ArrowLeft: 'left',
        KeyD: 'right',
        ArrowRight: 'right',
        ShiftLeft: "dash",
        ShiftRight: "dash"
    }
    /**
     * Handles key down events
     * @param {KeyboardEvent} event - The key down event
     */
    keydownHandler(event) {
        const key = this.keyMap[event.code]
        const velocity = this.rigidBody.velocity
        switch (key) {
            case "jump":
                if (isBottomColliding(this.rigidBody, this.engine)) {
                    Matter.Body.setVelocity(this.rigidBody, {
                        x: velocity.x,
                        y: velocity.y - config.jumpHeight
                    })
                }
                break
            case "left":
                this.isMovingLeft = true
                break
            case "right":
                this.isMovingRight = true
                break
            case "dash":
                Matter.Body.setSpeed(this.rigidBody, Math.min(this.rigidBody.speed + 20, config.maxSpeed))
                break
        }

    }

    /**
     * Handles key up events
     * @param {KeyboardEvent} event - The key up event
     */
    keyupHandler(event) {
        /**
         * Get the key from the event
         */
        const key = this.keyMap[event.code]
        switch (key) {
            case "left":
                this.isMovingLeft = false
                break;

            case "right":
                this.isMovingRight = false
                break
        }


    }

}