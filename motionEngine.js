//import { Polygon } from "https://cdn.jsdelivr.net/npm/@flatten-js/core@1.5.4"
//@ts-ignore
import config from "./config.js";
export class motionEngine {
    elements = [];
    lastUpdate = Date.now();
    gravity;
    PIXIContainer;
    constructor(gravity, container) {
        this.gravity = gravity;
        this.PIXIContainer = container;
        //@ts-ignore
        globalThis.tst = 0;
    }
    #applyGravity(element) {
        element.velocity.y += this.gravity;
    }
    #applyVelocities(element, deltaTime) {
        try {
            if (!element) {
                throw new Error("applyVelocities(): element is null");
            }
            const newPosition = { x: element.position.x, y: element.position.y };
            newPosition.x += element.velocity.x * deltaTime;
            newPosition.y += element.velocity.y * deltaTime;
            let collisionFound = false;
            for (let i = 0; i < this.elements.length; i++) {
                const element2 = this.elements[i];
                try {
                    //if (element2 && motionEngine.isCollidePolygon(element.polygon, element2.polygon)) {
                    //  collisionFound = true
                    //break
                    //}
                }
                catch (error) {
                    console.error("applyVelocities(): caught exception when checking for collision with element2", error);
                    throw error;
                }
            }
            if (newPosition.x !== element.position.x) {
                element.position.x = newPosition.x;
                if (element.velocity.x > 0) {
                    element.velocity.x -= element.resistance;
                    if (element.velocity.x < 0) {
                        element.velocity.x = 0;
                    }
                }
                else {
                    element.velocity.x += element.resistance;
                    if (element.velocity.x > 0) {
                        element.velocity.x = 0;
                    }
                }
            }
            if (newPosition.y !== element.position.y) {
                element.position.y = newPosition.y;
                if (element.velocity.y > 0) {
                    element.velocity.y -= element.resistance;
                    if (element.velocity.y < 0) {
                        element.velocity.y = 0;
                    }
                }
                else {
                    element.velocity.y += element.resistance;
                    if (element.velocity.y > 0) {
                        element.velocity.y = 0;
                    }
                }
            }
            if (!collisionFound) {
                console.log("applyVelocities(): no collision found");
            }
        }
        catch (error) {
            console.error("applyVelocities(): caught exception", error);
        }
    }
    #updatePIXI(element, appWidth, appHeight) {
        if (!element.pixi) {
            console.error("updatePIXI(): element.pixi is null or undefined", element);
            return;
        }
        const size = appWidth / config.maxBlocksInWindow;
        const maxYBlocks = Math.floor(appHeight / size) - 0.5;
        const newY = maxYBlocks - (config.worldBottom - element.position.y);
        try {
            element.pixi.position.y = newY * size;
        }
        catch (error) {
            console.error("updatePIXI(): error setting y position", element, error);
        }
        try {
            element.pixi.position.x = (element.position.x / config.maxBlocksInWindow) * appWidth;
        }
        catch (error) {
            console.error("updatePIXI(): error setting x position", element, error);
        }
        try {
            element.pixi.pivot = {
                x: element.position.x + 2,
                y: element.position.y + 2
            };
        }
        catch (error) {
            console.error("updatePIXI(): error setting pivot", element, error);
        }
        try {
            element.pixi.width = element.size.x * size;
        }
        catch (error) {
            console.error("updatePIXI(): error setting width", element, error);
        }
        try {
            element.pixi.height = element.size.y * size;
        }
        catch (error) {
            console.error("updatePIXI(): error setting height", element, error);
        }
    }
    addPIXI(element, pixiElement, render, color) {
        try {
            if (pixiElement == null || pixiElement == undefined) {
                throw new Error("addPIXI(): pixiElement is null or undefined");
            }
            this.PIXIContainer.addChild(pixiElement);
            if (render) {
                try {
                    pixiElement.poly(element.polygon);
                }
                catch (error) {
                    console.error("addPIXI(): error setting polygon", element, error);
                }
                if (color != null && color != undefined) {
                    try {
                        pixiElement.fill(color);
                    }
                    catch (error) {
                        console.error("addPIXI(): error setting fill color", element, error);
                    }
                }
                else {
                    try {
                        pixiElement.fill(0x000000);
                    }
                    catch (error) {
                        console.error("addPIXI(): error setting default fill color", element, error);
                    }
                }
            }
            element.pixi = pixiElement;
        }
        catch (error) {
            console.error("addPIXI(): unhandled exception", error);
        }
    }
    update(appWidth, appHeight) {
        try {
            const deltaTimeMS = Date.now() - this.lastUpdate;
            const deltaTime = deltaTimeMS / 1000;
            for (let i = 0; i < this.elements.length; i++) {
                const element = this.elements[i];
                if (!element.static) {
                    this.#applyGravity(element);
                    this.#applyVelocities(element, deltaTime);
                    //     for (let j = 0; j < this.elements.length; j++) {
                    //         const otherElement = this.elements[j]
                    //         if (element.uid !== otherElement.uid) {
                    //             if (element.polygon && otherElement.polygon) {
                    //                 console.log(element.polygon, otherElement.polygon)
                    //                 if (motionEngine.arePolygonsColliding(element.polygon, otherElement.polygon)) {
                    //                     console.log("Collision detected between elements", element.uid, "and", otherElement.uid)
                    //                 }
                    //             }
                    //         }
                    //     }
                }
                this.#updatePIXI(element, appWidth, appHeight);
            }
            this.lastUpdate = Date.now();
        }
        catch (error) {
            console.error("update(): unhandled exception", error);
        }
    }
    /**
     * Create a new collision box with the given polygon, position, size, and rotation
     * @param screenX
     * @param screenY
     * @param polygon Array of coordinates representing the polygon to be used for the collision box
     * @param position Object with x and y properties representing the position of the collision box
     * @param options Object with optional parameters (size, rotation, static, velocity, resistance, density)
     * @returns A new collision box with the given properties
     */
    createCollisionBox(screenX, screenY, polygon, position, options) {
        try {
            let size;
            let rotation;
            let isStatic;
            let velocity;
            let resistance;
            let density;
            if (polygon == null || polygon == undefined) {
                throw new Error("createCollisionBox(): polygon is null or undefined");
            }
            if (position == null || position == undefined) {
                throw new Error("createCollisionBox(): position is null or undefined");
            }
            if (options) {
                if (options.size == null || options.size == undefined) {
                    size = { x: 1, y: 1 };
                }
                else {
                    size = options.size;
                }
                if (options.rotation == null || options.rotation == undefined) {
                    rotation = 0;
                }
                else {
                    rotation = options.rotation;
                }
                if (options.static == null || options.static == undefined) {
                    isStatic = false;
                }
                else {
                    isStatic = options.static;
                }
                if (options.velocity == null || options.velocity == undefined) {
                    velocity = { x: 0, y: 0 };
                }
                else {
                    velocity = options.velocity;
                }
                if (options.resistance == null || options.resistance == undefined) {
                    resistance = 0.1;
                }
                else {
                    resistance = options.resistance;
                }
                if (options.density == null || options.density == undefined) {
                    density = 1;
                }
                else {
                    density = options.density;
                }
            }
            else {
                size = { x: 1, y: 1 };
                rotation = 0;
                isStatic = false;
                velocity = { x: 0, y: 0 };
                resistance = 0.1;
                density = 1;
            }
            const updatedPolygon = polygon.map((point) => {
                const { x, y } = {
                    x: point.x * (((screenX * config.appWidthMultiplier) / config.maxBlocksInWindow) * size.x),
                    y: point.y * (((screenY * config.appHeightMultiplier) / config.maxBlocksInWindow) * size.y)
                };
                // Project the point onto the new scale and position
                // We use this to ensure that all collision boxes are scaled correctly
                // relative to the size of the window
                return { x: x, y: y };
            });
            // Scale the size of the collision box to match the scale of the window
            // We do this so that when the user zooms in or out, the collision boxes will
            // still be the correct size
            const collisionBox = {
                polygon: updatedPolygon,
                position: position,
                size: size,
                velocity: velocity,
                rotation: rotation,
                basePolygon: polygon,
                static: isStatic,
                resistance: resistance,
                density: density,
                uid: this.elements.length,
                //@ts-ignore
                //flattenPolygon: new Polygon(updatedPolygon)
            };
            this.elements.push(collisionBox);
            // Return the new collision box
            //  this.#updatePIXI(collisionBox)
            return collisionBox;
        }
        catch (error) {
            console.error("createCollisionBox(): unhandled exception", error);
        }
    }
    static arePolygonsColliding(A, B, tolerance = 0) {
        return false;
        /*
        function convertToLineSegments(polygon: polygon): Array<Array<number>> {
            const lineSegments: Array<Array<number>> = []
            for (let i = 0; i < polygon.length - 1; i++) {
                const currentPoint = polygon[i]
                const nextPoint = polygon[i + 1]
                lineSegments.push([currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y])
            }
            lineSegments.push([polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y])
            return lineSegments
        }

        function doIntersect(segment1: Array<number>, segment2: Array<number>): boolean {
            /**
             * The main function that returns true if line segment 'p1q1'
             * and 'p2q2' intersect.
             * @param p1 - The start point of the first line segment.
             * @param q1 - The end point of the first line segment.
             * @param p2 - The start point of the second line segment.
             * @param q2 - The end point of the second line segment.
             * @returns True if the line segments intersect, false otherwise.
             
            function doIntersect(p1: { x: number; y: number }, q1: { x: number; y: number }, p2: { x: number; y: number }, q2: { x: number; y: number }): boolean {
                /**
                 * Given three collinear points p, q, r, the function checks if
                 * point q lies on line segment 'pr'
                 * @param p - The start point of the line segment.
                 * @param q - The point to check.
                 * @param r - The end point of the line segment.
                 * @returns True if the point is on the line segment, false otherwise.
                 
                function onSegment(p: { x: number; y: number }, q: { x: number; y: number }, r: { x: number; y: number }): boolean {
                    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
                        return true;

                    return false;
                }

                /**
                 * To find orientation of ordered triplet (p, q, r).
                 * The function returns following values
                 * 0 --> p, q and r are collinear
                 * 1 --> Clockwise
                 * 2 --> Counterclockwise
                 * @param p - The first point.
                 * @param q - The second point.
                 * @param r - The third point.
                 * @returns The orientation of the points.
                 
                function orientation(p: { x: number; y: number }, q: { x: number; y: number }, r: { x: number; y: number }): 0 | 1 | 2 {

                    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
                    // for details of below formula.
                    let val = (q.y - p.y) * (r.x - q.x) -
                        (q.x - p.x) * (r.y - q.y);

                    if (val == 0) return 0; // collinear

                    return (val > 0) ? 1 : 2; // clock or counterclock wise
                }


                // Find the four orientations needed for general and
                // special cases
                let o1 = orientation(p1, q1, p2);
                let o2 = orientation(p1, q1, q2);
                let o3 = orientation(p2, q2, p1);
                let o4 = orientation(p2, q2, q1);

                // General case
                if (o1 != o2 && o3 != o4)
                    return true;

                // Special Cases
                // p1, q1 and p2 are collinear and p2 lies on segment p1q1
                if (o1 == 0 && onSegment(p1, p2, q1)) return true;

                // p1, q1 and q2 are collinear and q2 lies on segment p1q1
                if (o2 == 0 && onSegment(p1, q2, q1)) return true;

                // p2, q2 and p1 are collinear and p1 lies on segment p2q2
                if (o3 == 0 && onSegment(p2, p1, q2)) return true;

                // p2, q2 and q1 are collinear and q1 lies on segment p2q2
                if (o4 == 0 && onSegment(p2, q1, q2)) return true;

                return false; // Doesn't fall in any of the above cases
            }

            return doIntersect({ x: segment1[0], y: segment1[1] }, { x: segment1[2], y: segment1[3] }, { x: segment2[0], y: segment2[1] }, { x: segment2[2], y: segment2[3] })
        }
        const polygonASegments = convertToLineSegments(polygonA)
        const polygonBSegments = convertToLineSegments(polygonB)
        for (let i in polygonASegments) {
            for (let j in polygonBSegments) {
                if (doIntersect(polygonASegments[i], polygonBSegments[j])) {
                    console.log("Segments are colliding", polygonASegments[i], polygonBSegments[j], i, j)
                    //return true //Requires just one intersection
                }
            }
    }
    */
        // return A.flattenPolygon.intersect(B.flattenPolygon).length > 0
    }
}
