import { LogicService } from "src/app/services/logic.service";
import { Drawer } from "../manager/support/Drawer";
import { LogicProcess } from "../manager/support/LogicProcess";
import { DrawingContext, LogicContext } from "../manager/support/SharedContext";
import { TileEntity } from "../TileEntity";

export class LevelMap implements Drawer, LogicProcess {
  private map:MapTile[][];
  private tileSize = 32;
  private halfTileSize = this.tileSize/2;
  private size = 90;

  constructor(){
    this.map = new Array();

    let randomness = Math.floor((Math.random()*10)+1);
    let randomnessCounter = 0;
    for(let i =0; i < this.size;i++){
      this.map[i] = new Array();
      for(let j =0; j < this.size;j++){
        randomnessCounter++;
        if(randomnessCounter >= randomness){
          this.map[i][j] = new MapTile(this, i,j,"#00FFFF",false);
          randomnessCounter = 0;
          randomness = Math.floor((Math.random()*10)+1);
        } else {
          this.map[i][j] = new MapTile(this, i,j,"#00FF00");
        }
      }
    }
  }

  update(logicContext: LogicContext) {
    // not sure it needs to do anything?
  }

  draw(dc: DrawingContext) {
    // for(let i =0; i < this.size;i++){
    //   for(let j =0; j < this.size;j++){
    //     LogicService.drawBox(
    //       i*this.tileSize, j * this.tileSize,
    //       this.tileSize,
    //       this.tileSize,
    //       dc.cc.bgCtx,this.map[i][j],"#FFEEDD");
    //   }
    // }
    const uiSet = dc.uis;


    let x = 0;
    let y = 0;
    for(let viewX = uiSet.viewTilesStartPosX; viewX < this.size && viewX < uiSet.viewTilesEndPosX; viewX++,x++){
      for(let viewY = uiSet.viewTilesStartPosY; viewY < this.size && viewY < uiSet.viewTilesEndPosY; viewY++,y++){
        if(viewX >= 0 && viewY >= 0){
          LogicService.drawBox(
            (x*uiSet.tileSize)-uiSet.viewXOffset,
            (y*uiSet.tileSize)-uiSet.viewYOffset,
            uiSet.tileSize,
            uiSet.tileSize,
            dc.cc.bgCtx,this.map[viewX][viewY].color,"#FFEEDD");
        }
      }
      y = 0;
    }

  }

  get(x: number, y: number):MapTile {
    return this.map[x][y];
  }

  getTiles():MapTile[][] {
    return this.map;
  }

  getTileSize():number {
    return this.tileSize;
  }
  getHalfTileSize():number {
    return this.halfTileSize;
  }

}

export class MapTile {
  // terrain type for speed?
  public posX:number;
  public posY:number;
  public centerX:number;
  public centerY:number;
  public tileEntity: TileEntity;

  constructor(
    map:LevelMap,
    public x:number,
    public y:number,
    public color:string,
    public passable:boolean = true ) {
    this.updateCords(map);
  }

  // GETTER SETTER
  removeTileEntity(){this.tileEntity = null;}
  setTileEntity(tileEntity: TileEntity){this.tileEntity = tileEntity;}

  updateCords(map:LevelMap){
    this.posX = this.x * map.getTileSize();
    this.posY = this.y * map.getTileSize();
    this.centerX = this.posX+ map.getHalfTileSize();
    this.centerY = this.posY+ map.getHalfTileSize();
  }
  getCenterX() {
    return this.centerX;
  }
  getCenterY() {
    return this.centerY;
  }
}