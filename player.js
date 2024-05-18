import {
    collidableSprite
} from "./collidableSprite.js";
import config from "./config.js";
import {
    controlsManager
} from "./controlsManager.js";

function isBottomColliding(playerObject, engine) {
    // Assuming 'engine.world' is your composite containing all bodies
    const allObjects = Matter.Composite.allBodies(engine.world);
    for (const object of allObjects) {
        if (object !== playerObject) {
            const collisionInfo = Matter.Collision.collides(playerObject, object);
            if (!collisionInfo) {
                continue
            }

            if (collisionInfo.collided && playerObject.bounds.max.y < object.bounds.max.y) {
                if (playerObject.position.x > object.bounds.min.x && playerObject.position.x < object.bounds.max.x) {
                    return true; // Player is standing on this object
                }
            }

        }
    }
    // No collision detected
    return false;
}

export class player extends collidableSprite {
    constructor(playerTexture, size, engine) {
        super(playerTexture, size, size * 2, 200, 100, false, true)
        this.engine = engine
        Matter.Body.setInertia(this.rigidBody, 1.5)
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
        this.lastControllerUpdate = Date.now()
        this.rigidBody.density = 0.001,
            this.rigidBody.friction = 0.3,
            this.rigidBody.frictionStatic = 0.08,
            this.rigidBody.frictionAir = 0.01,
            this.rigidBody.restitution = 0.4
    }
    limitMaxSpeed = () => {
        let maxSpeedX = config.maxXSpeed;
        let maxSpeedY = config.maxYSpeed;
        //if (this.rigidBody.speed > maxSpeedX) {
        //  Matter.Body.setSpeed(this.rigidBody, maxSpeedX)
        //}
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
        /*
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
                */
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
                console.log(this.rigidBody.speed)
                Matter.Body.setSpeed(this.rigidBody, this.rigidBody.speed + 20)
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

        /**
         * Stop moving the player and clear the interval
         */
        switch (key) {
            case "left":
                this.isMovingLeft = false
                //clearInterval(this.interval)
                break;

            case "right":
                this.isMovingRight = false
                //clearInterval(this.interval)
                break
        }


    }

}