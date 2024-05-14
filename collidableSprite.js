export class collidableSprite extends PIXI.Sprite {
    constructor(texture, game, width, height, x, y, isStatic) {
        console.log(arguments)
        super(texture)
        this.game = game
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