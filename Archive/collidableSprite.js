export class collidableSprite extends PIXI.Sprite {
    constructor(texture, width, height, x, y, isStatic, noRotate) {
        super(texture)
        this.noRotate = noRotate
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        let options = {
            friction: 0.5, // The friction coefficient. Higher values mean more friction
            restitution: 0.3, // The restitution coefficient. Higher values mean the object bounces more
            frictionStatic: true, // If true, the object will not be affected by dynamic friction when colliding with a static object
            frictionDynamic: 0.1, // The friction coefficient when colliding with a dynamic object
            restitutionStatic: 0.3, // The restitution coefficient when colliding with a static object
            restitutionDynamic: 0.1, // The restitution coefficient when colliding with a dynamic object
            density: 1.0, // The mass density of the object. Higher values make the object heavier
            slop: 0.0
        }

        this.rigidBody = Matter.Bodies.rectangle(x, y, width, height, options) //x,y,w,h
        if (isStatic) {
            this.rigidBody.isStatic = true;
        }
    }

    update() {
        this.position.set(this.rigidBody.position.x, this.rigidBody.position.y)

        if (!this.noRotate) {
            this.rotation = this.rigidBody.angle
        } else {
            Matter.Body.setAngularVelocity(this.rigidBody, 0)
        }
    }
}

