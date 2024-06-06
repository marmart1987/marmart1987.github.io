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
                const sprite = new PIXI.Sprite(assets[element.name])                    
                const collisionBox = engine.createCollisionBox(appWidth,appHeight,[{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }], { x: x, y: y }, { size: { x: 1, y: 1 }, static: true });
                engine.addPIXI(collisionBox, sprite);                   
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
    const scrollingRender = null
    console.time("Game assets loaded in")
    const assets = await PIXI.Assets.loadBundle('init');
    console.timeEnd("Game assets loaded in")
    let game = new PIXI.Container
    app.stage.addChild(game)
    const engine = new motionEngine(0.8, game)    

    renderInit(lvl, assets, engine)
    const collisionBox = engine.createCollisionBox(app.renderer.height * config.appHeightMultiplier, app.renderer.width * config.appWidthMultiplier, [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }], { x: 10, y: 80 }, { size: { x: 1, y: 1 }, static: false, velocity: {x:10, y:0} });
    engine.addPIXI(collisionBox, new PIXI.Graphics(), true, "red"); 
    console.log(collisionBox.pixi.position, collisionBox.position)
    app.ticker.add((time) => {
        engine.update(app.renderer.width,app.renderer.height)
    });
})();