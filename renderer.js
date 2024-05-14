let app = new PIXI.Application();
import config from "./config.js";
import {
    collidableSprite
} from "./collidableSprite.js";
globalThis.__PIXI_APP__ = app;
window.onscroll = function () {
    window.scrollTo(0, 0);
};

function render(level, assets, game) {
    let appHeight = app.renderer.height * config.appHeightMultiplier
    let appWidth = app.renderer.width * config.appWidthMultiplier
    for (let y = level.map.length - 1; y > -1; y--) {
        let row = level.map[y]
        row.forEach((element, x) => {
            if (element.imagePath) {

                let sprite = new PIXI.Sprite(assets[element.name])
                sprite.anchor.set(0.5);
                game.addChild(sprite)
                const size = appWidth / config.maxBlocksInWindow
                sprite.width = sprite.height = size
                sprite.x = x * size + size / 2
                sprite.y = appHeight - ((config.worldBottom + 1 - y) * size + size / 2)

            }
        })
    }
}

(async () => {
    await app.init({
        background: '#1099bb',
        resizeTo: window
    });


    document.body.appendChild(app.canvas);
    PIXI.Assets.init({
        manifest: level.compileAssets(Object.values(block.blockTypes))
    })
    const assets = await PIXI.Assets.loadBundle('init');

    console.log(assets)
    const engine = new collisionEngine(PIXI)
    let testSprite = new collidableSprite(assets.baseplate, engine, false)
    engine.addUpdatingSprite(testSprite)



    console.log(engine)



    app.stage.addChild(testSprite)
    let lvl = new level(418)
    let game = new PIXI.Container
    app.stage.addChild(game)
    game.scale.x = game.scale.y = 1
    app.ticker.add((time) => {
        game.destroy({
            children: true
        })
        engine.update()
        game = new PIXI.Container
        app.stage.addChild(game)
        game.scale.x = game.scale.y = 1
        render(lvl, assets, game)
    });

})();

class collisionEngine {

    pixi
    engine
    elements = []

    constructor(pixi) {
        console.log("Collisons starting")
        this.pixi = pixi
        this.engine = Matter.Engine.create({
            gravity: {
                y: 1
            }
        })
        this.engine.world.gravity.scale = 0.001

        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))
    }
    addUpdatingSprite(collidableSprite) {
        Matter.Composite.add(this.engine.world, collidableSprite.rigidBody)
        this.elements.push(collidableSprite)
    }

    update() {
        Matter.Engine.update(this.engine, 1000 / 60)
        for (let el of this.elements) {
            console.log(el.rigidBody.position)
            el.update()
        }
    }

    // check who hits what 
    onCollision(event) {
        let collision = event.pairs[0]
        console.log(event, collision)
    }


    findSpriteWithRigidbody(rb) {
        return this.elements.find((element) => element.rigidBody === rb)
    }

    removeElement(element) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody) // stop physics simulation
        this.pixi.stage.removeChild(element) // stop drawing on the canvas
        this.elements = this.elements.filter((el) => el != element) // stop updating
        // console.log(`Removed id ${element.id}. Elements left: ${this.elements.length}`)
    }

}