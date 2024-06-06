"use strict";
class scrollingRender {
    mapCopy;
    _render = [["If you see this, you accesced the render property of the scrollingRender class too early"]];
    _currentXScroll = 0;
    configRenderCutSize;
    constructor(map, configRenderCutSize) {
        this.configRenderCutSize = configRenderCutSize;
        this.mapCopy = map;
        this.update();
    }
    update() {
        this._render = this.mapCopy.map((row) => {
            let startOfCut = this._currentXScroll - this.configRenderCutSize / 2; //Get the start of the cut
            let endOfCut = this._currentXScroll + this.configRenderCutSize / 2; // Get the end of the cut
            if (startOfCut < 0) { //If the start of the cut is less than 0 (which would make it a negative number and break the game)
                startOfCut = 0; //  set the start of the cut to 0
            }
            if (endOfCut > row.length) { // If the end of the cut is greater than the length of the row
                endOfCut = row.length; //set the end of the cut to the length of the row
            }
            return row.slice(startOfCut, endOfCut); // Slice the row from the start of the cut to the end of the cut
        });
    }
    setScroll(x) {
        this._currentXScroll = x;
        this.update();
    }
    scrollBy(x) {
        this._currentXScroll += x;
        this.update();
    }
    get render() {
        return this._render;
    }
}
