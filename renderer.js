let app = new PIXI.Application();
import config from "./config.js";
import {motionEngine} from "./motionEngine.js"
import { level, map, block } from "./level.js";
globalThis.__PIXI_APP__ = app;

window.onscroll = function () {
    window.scrollTo(0, 0);
};
document.documentElement.style.overflow = 'hidden'; // firefox, chrome
document.body.scroll = "no"; // ie only

function renderInit(level, assets, engine) {
    let appWidth = app.renderer.width * config.appWidthMultiplier
    let appHeight = app.renderer.height * config.appHeightMultiplier
    for (let y = level.map.length - 1; y > -1; y--) {
        let row = level.map[y]
        row.forEach((element, x) => {
            if (element.imagePath) {
                if (Math.random() > 0.5) {

                    const sprite = new PIXI.Sprite(assets[element.name])                    
                    const collisionBox = engine.createCollisionBox(appWidth,appHeight,[{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }], { x: x, y: y }, { size: { x: 1, y: 1 }, static: true });
                    engine.addPIXI(collisionBox, sprite);   
                    if(Math.random() > 0.9){
                        console.log(x,y)
                    }
                }
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
   

    const lvl = new level()
    
    
    console.time("Game assets loaded in")
    const assets = await PIXI.Assets.loadBundle('init');
    console.timeEnd("Game assets loaded in")
    let game = new PIXI.Container
    app.stage.addChild(game)
    game.scale.x = game.scale.y = 1
    const engine = new motionEngine(0.8, game)    

    renderInit(lvl, assets, engine)
    const collisionBox = engine.createCollisionBox(app.renderer.height * config.appHeightMultiplier, app.renderer.width * config.appWidthMultiplier, [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }], { x: 10, y: 80 }, { size: { x: 1, y: 1 }, static: false, velocity: {x:10, y:0} });
    engine.addPIXI(collisionBox, new PIXI.Graphics(), true, "red"); 
    console.log(collisionBox.pixi.position, collisionBox.position)

    for (let j = 0; j < engine.elements.length; j++) {
        const otherElement = engine.elements[j]
        if (collisionBox.uid !== otherElement.uid) {
            if (collisionBox.polygon && otherElement.polygon) {
                console.log("Next polygon!")
                                if (motionEngine.arePolygonsColliding(collisionBox.polygon, otherElement.polygon)) {
                                    console.log("Collision detected between elements", collisionBox.uid, "and", otherElement.uid)
                                }
             }
        }
    }


    app.ticker.add((time) => {
        engine.update(app.renderer.width,app.renderer.height)
    });
})();
    /*
    let touchLeft = false
    let touchRight = false

    
    addEventListener("touchstart", (event) => {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i]
            if (touch.pageX > app.renderer.width / 2) {
                touchRight = true
                Player.isMovingRight = true
            } else {
                touchLeft = true
                Player.isMovingLeft = true
            }
        }

        if (touchLeft && touchRight) {
            const velocity = Player.rigidBody.velocity
            console.log("jump")
            Matter.Body.setVelocity(Player.rigidBody, {
                x: velocity.x,
                y: velocity.y - config.jumpHeight
            })
        }
        console.log(Player.isMovingLeft, Player.isMovingRight)

    });
    addEventListener("touchend", (event) => {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i]
            if (touch.pageX > app.renderer.width / 2) {
                Player.isMovingRight = false
                touchRight = false
            } else {
                Player.isMovingLeft = false
                touchLeft = false
            }
        }

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
        window.addEventListener('resize', (event) => {
            this.resize()
        }, true);
    }

    scrollBy(amount) {
        this.all.forEach((element) => {
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
    /**
     * This function is called when the window is resized. It updates all the sprites
     * in the engine to the correct position and size on the screen.
     * 
     * This is done by first calculating the size of a single block in pixels. This
     * is done by dividing the width of the screen by the maximum number of blocks
     * in the window, and then multiplying this by the config.appWidthMultiplier.
     * 
     * Then, for each sprite in the engine, it calculates the x and y position
     * of the sprite in terms of blocks. This is done by dividing the sprite's x and
     * y position by the size of a block. The x position is then multiplied by
     * the size of a block to get the correct x position in pixels. The y position
     * is then multiplied by the size of a block, and then added to the height of
     * a block minus half of the size of a block. This is because the y position
     * of the sprite is measured from the top of the screen, and the y position of
     * the sprite is measured from the bottom of its bounding box. So we need to
     * add the height of the block minus half of the size of the block to get the
     * correct y position in pixels.
     * 
     * The sprite is then set to have the size of a block and its new position
     * in pixels.
     
    resize() {

        /*
        console.log("Resizing engine")
        const size = (app.renderer.width * config.appWidthMultiplier) / config.maxBlocksInWindow
        console.log("Size", size)

        this.all.forEach((el) => {
            // Calculate the x and y position of the sprite in terms of blocks
            const x = Math.ceil(el.x / size)
            const y = Math.ceil(el.y / size)

            // Calculate the correct x position in pixels
            const xPixels = x * size + size / 2

            // Calculate the correct y position in pixels
            const yPixels = (y * size * 0.8 + size * 0.8 / 2)

            // Set the sprite to have the size of a block and its new position in pixels
            Matter.Body.set(el, {
                width: size,
                height: size,
                x: xPixels,
                y: yPixels
            })
        });
        
    }


    update(elapsed) {
 

        const player = this.player
        if (player) {
            player.update()
            controlsManager(player, elapsed)
/*
            if (player.rigidBody.position.x > app.renderer.width * 0.95 * config.appWidthMultiplier) {
                this.scrollBy(0.4 * app.renderer.width)
                Matter.Body.setPosition(player.rigidBody, {
                    x: app.renderer.width * 0.4,
                    y: player.rigidBody.position.y
                })
                this.page++
                console.log("scroll", this.page)
            }

            if (player.rigidBody.position.x < app.renderer.width * 0.1 && this.page > 0) {
                this.scrollBy(-0.4 * app.renderer.width)
                Matter.Body.setPosition(player.rigidBody, {
                    x: app.renderer.width * 0.9,
                    y: player.rigidBody.position.y
                })
                this.page--
                console.log("scroll", this.page)
            }

            
            if (player.rigidBody.position.y > app.renderer.height || player.rigidBody.position.x < 0 || player.rigidBody.position.y > 100000) {
                this.player = null
                console.log("Player fell out of the world")
            }
        }
       
        Matter.Engine.update(this.engine, elapsed)
        this.all.forEach((el) => el.update())

    }


    findSpriteWithRigidbody(rb) {
        return this.all.find((element) => element.rigidBody === rb)
    }

    removeElement(element) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody) // stop physics simulation
        this.pixi.stage.removeChild(element) // stop drawing on the canvas
        
    }
}
*/