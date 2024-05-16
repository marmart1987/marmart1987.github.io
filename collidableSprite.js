export class collidableSprite extends PIXI.Sprite {
    constructor(texture, width, height, x, y, isStatic, noRotate) {
        super(texture)
        this.noRotate = noRotate
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        let options = {}


        this.rigidBody = Matter.Bodies.rectangle(x, y, width, height, options) //x,y,w,h
        if (isStatic) {
            this.rigidBody.isStatic = true;
        }
        this.rigidBody.density = 0.01;


    }

    update() {
        this.position.set(this.rigidBody.position.x, this.rigidBody.position.y)

        this.rotation = this.rigidBody.angle
        if (this.noRotate) {
            Matter.Body.setAngularVelocity(this.rigidBody, 0)
        }
    }

    resetPosition() {
        Matter.Body.setPosition(this.rigidBody, {
            x: 100,
            y: 30
        })
        Matter.Body.setVelocity(this.rigidBody, {
            x: 0,
            y: 10
        })
        // Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

    beforeUnload() {

    }
}