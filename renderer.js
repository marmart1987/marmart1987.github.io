let app = new PIXI.Application();
import config from "./config.js";
import {
    collidableSprite
} from "./collidableSprite.js";
import {
    player
} from "./player.js";
globalThis.__PIXI_APP__ = app;
window.onscroll = function () {
    window.scrollTo(0, 0);
};


function renderInit(level, assets, game, engine) {
    let appHeight = app.renderer.height * config.appHeightMultiplier
    let appWidth = app.renderer.width * config.appWidthMultiplier
    for (let y = level.map.length - 1; y > -1; y--) {
        let row = level.map[y]
        row.forEach((element, x) => {
            if (element.imagePath) {
                const size = appWidth / config.maxBlocksInWindow
                let sprite = new collidableSprite(assets[element.name], size, size, x * size + size / 2, appHeight - ((config.worldBottom + 1 - y) * size + size / 2), true)
                console.log(sprite)

                engine.addUpdatingSprite(sprite)
                sprite.anchor.set(0.5);
                game.addChild(sprite)
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
    globalThis.engine = engine

    let lvl = new level(418)
    let game = new PIXI.Container
    app.stage.addChild(game)
    game.scale.x = game.scale.y = 1
    renderInit(lvl, assets, game, engine)


    let Player = new player(await PIXI.Assets.load("./Assets/Player.png"), 50, engine.engine)
    engine.addUpdatingSprite(Player)
    engine.player = Player
    Player.anchor.set(0.5);
    app.stage.addChild(Player)

    let sprite = new collidableSprite(assets.baseplate, 100, 100, 100, 200, false)
    console.log("Falling sprite", sprite)
    engine.addUpdatingSprite(sprite)
    sprite.anchor.set(0.5);
    app.stage.addChild(sprite)



    document.documentElement.style.overflow = 'hidden'; // firefox, chrome
    document.body.scroll = "no"; // ie only


    app.ticker.add((time) => {
        engine.update(time.deltaMS)
    });

})();

class collisionEngine {
    all = []
    entities = []
    map = []
    player = null


    constructor(pixi) {
        console.log("Collisons starting")
        this.pixi = pixi
        this.engine = Matter.Engine.create({
            gravity: {
                y: 1
            },
            width: window.screen.width,
            height: window.screen.height
        })

        this.engine.gravity.scale = 0.001
    }

    scrollBy(amount) {
        this.all.forEach(function (element) {
            Matter.Body.setPosition(element.rigidBody, {
                x: element.rigidBody.position.x - amount,
                y: element.rigidBody.position.y
            })
        })
    }

    addUpdatingSprite(collidableSprite) {
        Matter.Composite.add(this.engine.world, collidableSprite.rigidBody)

        if (!collidableSprite.rigidBody.isStatic) {
            if (collidableSprite.keyMap) {
                this.player = collidableSprite
            } else {
                this.entities.push(collidableSprite)
                this.all.push(collidableSprite)
            }
        } else {

            this.map.push(collidableSprite)
            this.all.push(collidableSprite)

        }
    }

    update(elapsed) {
        Matter.Engine.update(this.engine, elapsed)
        for (let el of this.all) {
            el.update()
        }
        if (this.player) {
            let player = this.player
            if (player.rigidBody.position.x > 0.95 * app.renderer.width) {
                this.scrollBy(0.4 * app.renderer.width)
                Matter.Body.setPosition(player.rigidBody, {
                    x: app.renderer.width * 0.4,
                    y: player.rigidBody.position.y
                })
            }
            if (player.rigidBody.position.y > app.renderer.height) {
                this.player = null
                console.log("Player fell out of the world")
            }
            player.update()
        }

    }


    findSpriteWithRigidbody(rb) {
        return this.elements.find((element) => element.rigidBody === rb)
    }

    removeElement(element) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody) // stop physics simulation
        this.pixi.stage.removeChild(element) // stop drawing on the canvas
        this.elements = this.elements.filter((el) => el != element) // stop updating
    }

}