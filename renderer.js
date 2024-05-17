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
    Matter.Composite.add(engine.engine.world,
        Matter.Bodies.rectangle(0, 0, appWidth * 0.02, 50000, {
            isStatic: true
        }),
    )
    Matter.Composite.add(engine.engine.world,
        Matter.Bodies.rectangle(appWidth, 0, appWidth * 0.02, 50000, {
            isStatic: true
        }),

    )


    for (let y = level.map.length - 1; y > -1; y--) {
        let row = level.map[y]
        row.forEach((element, x) => {
            if (element.imagePath) {
                const size = appWidth / config.maxBlocksInWindow
                let sprite = new collidableSprite(assets[element.name], size, size, x * size + size / 2, appHeight - ((config.worldBottom + 1 - y) * size + size / 2), true)
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
    let startLoadingAssetsTime = Date.now()
    const assets = await PIXI.Assets.loadBundle('init');
    console.debug("Game assets loaded in", Date.now() - startLoadingAssetsTime, "MS")
    const engine = new collisionEngine(PIXI)


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
    page = 0


    constructor(pixi) {
        console.debug("Engine starting")
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
            if (player.rigidBody.position.x >= 0.95 * app.renderer.width * config.appWidthMultiplier) {
                this.scrollBy(0.4 * app.renderer.width)
                this.page++
                console.log("scroll", this.page)
                Matter.Body.setPosition(player.rigidBody, {
                    x: app.renderer.width * 0.4,
                    y: player.rigidBody.position.y
                })
            }
            if (player.rigidBody.position.x < 0.1 * app.renderer.width && this.page > 0) {
                this.scrollBy(-0.4 * app.renderer.width)
                this.page--
                console.log("scroll left", this.page)
                Matter.Body.setPosition(player.rigidBody, {
                    x: app.renderer.width * 0.9,
                    y: player.rigidBody.position.y
                })
            }
            if (player.rigidBody.position.y > app.renderer.height || player.rigidBody.position.x < 0 || player.rigidBody.position.y > 100000) {
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