import { LogicService } from "src/app/services/logic.service";
import { Drawer } from "../manager/support/display/Drawer";
import { UiSettings } from "../manager/support/display/UiSettings";
import { LogicProcess } from "../manager/support/logic/LogicProcess";
import { DrawingContext, LogicContext } from "../manager/support/SharedContext";
import { Opt } from "../Opt";
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

  init(logicContext: LogicContext) {}
  destroy(logicContext: LogicContext) {}
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
    const uiSet = dc.uiSet;


    let x = 0;
    let y = 0;
    for(let viewX = uiSet.viewTilesStartPosX; viewX < this.size && viewX < uiSet.viewTilesEndPosX; viewX++,x++){
      for(let viewY = uiSet.viewTilesStartPosY; viewY < this.size && viewY < uiSet.viewTilesEndPosY; viewY++,y++){
        if(viewX >= 0 && viewY >= 0) {
          const tile = this.get(viewX,viewY);
          tile.draw(dc,x,y);
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
  // Layers of a tile. Terrain type, construct, item, entity
  public tileConstruct: TileEntity = null; // gate? bridge? train track?
  public tileItem: TileEntity = null; // lump of gold, piece of a mech, resoruces, water
  public tileEntity: TileEntity = null; // moving, thinking bot.

  public cornerCords:{TL:{x,y}, TR:{x,y}, BL:{x,y}, BR:{x,y}};

  constructor(
    map:LevelMap,
    public x:number,
    public y:number,
    public color:string, // TODO replace with a terrain type
    public passable:boolean = true ) {
    this.updateCords(map);
  }

  // GETTER SETTER
  optTileEntity(){
    return new Opt(this.tileEntity);
  }
  removeTileEntity(){this.tileEntity = null;}
  setTileEntity(tileEntity: TileEntity){this.tileEntity = tileEntity;}

  updateCords(map:LevelMap){
    this.posX = this.x * map.getTileSize();
    this.posY = this.y * map.getTileSize();
    this.centerX = this.posX+ map.getHalfTileSize();
    this.centerY = this.posY+ map.getHalfTileSize();
    this.cornerCords = {TL:{x:this.posX,y:this.posY}, TR:{x:this.posX+map.getTileSize(),y:this.posY},
      BL:{x:this.posX,y:this.posY+map.getTileSize()}, BR:{x:this.posX+map.getTileSize(),y:this.posY+map.getTileSize()}};
  }
  getCenterX() {
    return this.centerX;
  }
  getCenterY() {
    return this.centerY;
  }
  getCords(): {x:number,y:number}{
    return {x:this.x,y:this.y}
  }
  getCornerCords(): {TL:{x,y}, TR:{x,y}, BL:{x,y}, BR:{x,y}}{
    return this.cornerCords;
  }
  /**
   * The top left position of the first and main tile. Adjusted for ui offset movement.
   * Could be used for accurate drawing.
   */
  getUiCords(uiSet:UiSettings): {x:number,y:number}{
    return { x:((this.x*uiSet.tileSize)-uiSet.curX),
            y:((this.y*uiSet.tileSize)-uiSet.curY)}
  }

  getTraverseStatus() : TraverseStatus {
    // TODO update this object when things change rather than building it every time.
    return new TraverseStatus(this,
      this.passable,
      false,false, // construct
      false, false, // item
      this.optTileEntity().isPresent(),false // entity
      );
  }

  draw(dc: DrawingContext,x,y) {
    const uiSet = dc.uiSet;
    LogicService.drawBox(
      (x*uiSet.tileSize)-uiSet.viewXOffset,
      (y*uiSet.tileSize)-uiSet.viewYOffset,
      uiSet.tileSize,
      uiSet.tileSize,
      dc.cc.bgCtx,this.color,"#FFEEDD");
    this.tileEntity?.draw(dc);
  }

}

export class TraverseStatus {

  // maybe add speed slowdown/speed up? or the max speed the terrain supports?

  constructor(
    tile:MapTile,
    passable:boolean=true,
    constructOccupied:boolean=false,
    constructCrushable:boolean=false,
    itemOccupied:boolean=false,
    itemCrushable:boolean=false,
    entityOccupied:boolean=false,
    entityCrushable:boolean=false,
  ){

  }

}
