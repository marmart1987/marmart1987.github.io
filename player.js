import {
    collidableSprite
} from "./collidableSprite.js";
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
            if (collisionInfo.collided && playerObject.position.y < object.position.y) {
                return true; // Player is standing on this object
            }
        }
    }
    // No collision detected
    return false;
}

export class player extends collidableSprite {
    constructor(playerTexture, size, engine) {
        super(playerTexture, size, size * 2, 100, 100, false, true)
        this.engine = engine
        Matter.Body.setInertia(this.rigidBody, 1.5)
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
        this.lastControllerUpdate = Date.now()
        this.rigidBody.density = 0.001,
            this.rigidBody.friction = 0.7,
            this.rigidBody.frictionStatic = 0,
            this.rigidBody.frictionAir = 0.02,
            this.rigidBody.restitution = 0.5,
            this.update = function () {
                this.position.set(this.rigidBody.position.x, this.rigidBody.position.y)
                this.rotation = this.rigidBody.angle
                if (this.noRotate) {
                    Matter.Body.setAngularVelocity(this.rigidBody, 0)
                }
            }

        const limitMaxSpeed = () => {
            let maxSpeedX = 4;
            let maxSpeedY = 13;
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
        Matter.Events.on(engine, 'beforeUpdate', limitMaxSpeed);
    }
    keyMap = {
        Space: 'jump',
        KeyW: 'jump',
        ArrowUp: 'jump',
        KeyA: 'left',
        ArrowLeft: 'left',
        KeyD: 'right',
        ArrowRight: 'right',
    }
    keydownHandler(event) {
        const key = this.keyMap[event.code]
        const velocity = this.rigidBody.velocity
        switch (key) {
            case "jump":
                if (isBottomColliding(this.rigidBody, this.engine)) {
                    Matter.Body.setVelocity(this.rigidBody, {
                        x: velocity.x,
                        y: velocity.y - 13
                    })
                    console.log("jump")
                }
                break
            case "left":

                this.isMovingLeft = true
                // console.log("left", [this.isMovingLeft, this.isMovingRight])
                break
            case "right":

                this.isMovingRight = true
                // console.log("right", [this.isMovingLeft, this.isMovingRight])
                break
        }
        if (this.isMovingLeft || this.isMovingRight) {
            this.interval = setInterval((dt) => {
                controlsManager(this, dt)
                this.lastControllerUpdate = Date.now()
            }, 10, Date.now() - this.lastControllerUpdate)
        }
    }
    keyupHandler(event) {
        const key = this.keyMap[event.code]

        switch (key) {
            case "left":
                this.isMovingLeft = false
                clearInterval(this.interval)
                break;

            case "right":
                this.isMovingRight = false
                clearInterval(this.interval)
                break
        }


    }
}