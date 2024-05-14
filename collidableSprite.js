export class collidableSprite extends PIXI.Sprite {

    rigidBody;
    game;

    constructor(texture, game, staticB) {
        super(texture)
        this.game = game
        //this.anchor.set(0.5)
        this.width = 30
        this.height = 30

        this.rigidBody = Matter.Bodies.rectangle(100, 100, 100, 100, {
            static: staticB
        }) //x,y,w,h
        //this.rigidBody.isStatic = false;
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