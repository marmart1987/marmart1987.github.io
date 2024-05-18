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
        this.rigidBody.density = 0.01,
            this.rigidBody.friction = 0.5,
            this.rigidBody.frictionStatic = 0.2,
            this.rigidBody.frictionAir = 0.,
            this.rigidBody.restitution = 0.6


        //Matter.Events.on(engine, 'beforeUpdate', limitMaxSpeed);

    }
    limitMaxSpeed = () => {
        let maxSpeedX = config.maxXSpeed;
        let maxSpeedY = config.maxYSpeed;
        if (this.rigidBody.speed > maxSpeedX) {
            Matter.Body.setSpeed(this.rigidBody, maxSpeedX)
        }
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
    keydownHandler(event) {
        const key = this.keyMap[event.code]
        console.log(key, event.code)
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