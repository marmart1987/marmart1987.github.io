export class collidableSprite extends PIXI.Sprite {

    rigidBody;
    game;

    constructor(texture, game, name, ) {
        super(texture)
        this.game = game
        //this.anchor.set(0.5)
        this.width = 30
        this.height = 30
        this.rigidBody = Matter.Bodies.rectangle(100, 100, 60, 60, {
            label: name ? name : "",
            friction: 0.00001,
            restitution: 0.5,
            density: 0.001
        }) //x,y,w,h
        //this.resetPosition()

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