import { CustomKeyboardEvent } from "src/app/services/keyboard-event.service";

/**
 * Allow the player to zoom in and out? etc
 * That would change the tile size
 * It would also change the aspect ratio of drawing
 */

export class UiSettings {
  public pressedKeys = {"left":false,"up":false,"right":false,"down":false};

  // calcaulted values
  public viewAmountTilesX:number=0;
  public viewAmountTilesY:number=0;
  public viewTilesStartPosX:number=0;
  public viewTilesStartPosY:number=0;
  public viewTilesEndPosX:number=0;
  public viewTilesEndPosY:number=0;
  public viewXOffset:number=0;
  public viewYOffset:number=0;

  constructor(
    private _tileSize: number = 32,
    private _curX: number = 0,
    private _curY: number = 0,
    private _viewportSizeX: number = 640,
    private _viewportSizeY: number = 640,
    private _movementDistance:number=3,
    private _zoomDistance: number = 1,
  ) {
    this.reCalcualteValues();
  }

  /**
   * Triggered every time something in the view changes, we need to re calcaulte the values used for drawing.
   */
  public reCalcualteValues() {
    // todo do zoom first

    // todo account for the tiles that will be offscreen if we scroll to far to the left or right, no point in drawing them then.
    // also account for the last time the tile index changed, only then recalcuate the values you need again.

    // How many tiles can we posibly show?
    this.viewAmountTilesX = Math.round(this.viewportSizeX/this.tileSize)+2; // an extra one on the edges :D
    this.viewAmountTilesY = Math.round(this.viewportSizeY/this.tileSize)+2;

    // where to start in the array
    this.viewTilesStartPosX = Math.floor(this.curX/this.tileSize);
    this.viewTilesStartPosY = Math.floor(this.curY/this.tileSize);
    // this.viewTilesStartPosX = (this.viewTilesStartPosX<0)?0:this.viewTilesStartPosX;
    // this.viewTilesStartPosY = (this.viewTilesStartPosY<0)?0:this.viewTilesStartPosY;

    this.viewTilesEndPosX = this.viewTilesStartPosX+this.viewAmountTilesX;
    this.viewTilesEndPosY = this.viewTilesStartPosY+this.viewAmountTilesY;

    // How much of an x/y offset do we have to show on the edges
    this.viewXOffset = this.curX%this.tileSize;
    this.viewYOffset = this.curY%this.tileSize;
    // fix the negative problem for the -1 problem, only a p
    if(this.viewXOffset < 0) {// its going to jump a full 32 pixels we have to account for that
      this.viewXOffset += this.tileSize;
    }
    if(this.viewYOffset < 0) {// its going to jump a full 32 pixels we have to account for that
      this.viewYOffset += this.tileSize;
    }

    console.log("reCalcualteValues UI:",this);
  }

  public get tileSize() { return this._tileSize; }
  public set tileSize(tileSize) { this._tileSize = tileSize; }
  public get curX() { return this._curX; }
  public set curX(curX) { this._curX = curX; }
  public get curY() { return this._curY; }
  public set curY(curY) { this._curY = curY; }
  public get viewportSizeY(): number {return this._viewportSizeY;}
  public set viewportSizeY(value: number) {this._viewportSizeY = value;}
  public get viewportSizeX(): number {return this._viewportSizeX;}
  public set viewportSizeX(value: number) {this._viewportSizeX = value;}
  public get zoomDistance(): number {return this._zoomDistance;}
  public set zoomDistance(value: number) {this._zoomDistance = value;}


  update(){
    if(this.pressedKeys["left"] ||this.pressedKeys["up"] ||this.pressedKeys["right"] ||this.pressedKeys["down"]){
      if(this.pressedKeys["left"]){
        this.curX-=this._movementDistance;
      }
      if(this.pressedKeys["up"]){
        this.curY-=this._movementDistance;
      }
      if(this.pressedKeys["right"]){
        this.curX+=this._movementDistance;
      }
      if(this.pressedKeys["down"]){
        this.curY+=this._movementDistance;
      }
      this.reCalcualteValues();
    }
  }

  processKeyDown(customKeyboardEvent:CustomKeyboardEvent){
    if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
      this.pressedKeys["left"] = true;
    } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - down
      this.pressedKeys["down"] = true;
    } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
      this.pressedKeys["right"] = true;
    } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- up
      this.pressedKeys["up"] = true;
    }
  }

  processKeyUp(customKeyboardEvent:CustomKeyboardEvent){
    if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
      this.pressedKeys["left"] = false;
    } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - down
      this.pressedKeys["down"] = false;
    } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
      this.pressedKeys["right"] = false;
    } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- up
      this.pressedKeys["up"] = false;
    }
  }

  // todo handle the zoom here
  public getZoomSize(size:number):number {
    return size;
  }
}
