import { BotTeam, HasTeam } from "./bot/BotTeam";
import { Cords } from "./Cords";
import { Drawer } from "./manager/support/display/Drawer";
import { UiSettings } from "./manager/support/display/UiSettings";
import { DrawingContext } from "./manager/support/SharedContext";
import { LevelMap } from "./map/LevelMap";

export enum EntityState {
  // Sensors
  TrackingUnknown='TrackingUnknown',
  TrackingEnemy='TrackingEnemy',

  // Combat
  UnderAttack='UnderAttack', // this entity is being fired upon
  Attacking='Attacking', // this entity is attacking something else
  Damaged='Damaged', // this entity has been damaged
  Destroyed='Destroyed', // this entity has been destroyed, 0hp
  BeingRepairing='BeingRepairing',
  Repairing='Repairing',

  // Movement
  Walking='Walking',
  Running='Running',

  // Actions ?

}

/**
 * Anything than exists on a tile and is not just background. Unit, building etc
 */
 export interface TileEntity extends Drawer, HasTeam {
  isPassable():boolean;
  toggleState(entityState:EntityState);
  setState(entityState: EntityState, bool:boolean);
  getState(entityState:EntityState):boolean;
  getStates():Map<EntityState,boolean>;
  getLogicVariables():Map<string,any>;
  getTileCords():{x:number,y:number};
  getCenterCords(uiSet:UiSettings): {x:number,y:number}
  getTileSizes():{tileSizeX:number,tileSizeY:number};
}

export abstract class AbsTileEntity implements TileEntity {
  private states:Map<EntityState,boolean> = new Map();
  private logicVariables:Map<string,any> = new Map();

  constructor(
    public config:any,
    public botTeam:BotTeam,
    public tileX:number, // which tile the bot is on (the top left one anyway)
    public tileY:number,
    public tileSizeX:number, // how many tiles the bot occupies in the x direction
    public tileSizeY:number,
  ){

  }

  isPassable(): boolean {
    return false;
  }

  getTileCords():Cords {
    return new Cords(this.tileX, this.tileY);
  }

  getTileSizes():{tileSizeX:number,tileSizeY:number} {
    return {tileSizeX:this.tileSizeX, tileSizeY:this.tileSizeY};
  }
  /**
   * The top left position of the first and main tile. Adjusted for ui offset movement.
   * Could be used for accurate drawing.
   */
  getUiCords(uiSet:UiSettings): {x:number,y:number}{
    return {
            x:((this.tileX*uiSet.tileSize)-uiSet.curX),
            y:((this.tileY*uiSet.tileSize)-uiSet.curY)
          }
  }
  /** Filps the current value of a state or sets it to true if its never been set */
  toggleState(entityState: EntityState) {
    if(this.states.has(entityState)) {
      this.states.set(entityState,!this.states.get(entityState));
    } else {
      this.states.set(entityState, true);
    }
  }
  setState(entityState: EntityState, bool:boolean) {
    this.states.set(entityState, bool);
  }
  getState(entityState: EntityState): boolean {
    if(this.states.has(entityState))
      return this.states.get(entityState);
    else return false;
  }
  getStates(): Map<EntityState,boolean> {
    return this.states;
  }

  getLogicVariables(): Map<string, any> {
    return this.logicVariables;
  }


  // impl can override to increase accuracy with posx instead of tiles.
  getCenterCords(uiSet:UiSettings): {x:number,y:number}{
    let cX = (uiSet.tileSize*this.tileSizeX)/2
    let cY = (uiSet.tileSize*this.tileSizeY)/2
    return {
      x:((this.tileX*uiSet.tileSize)+cX),
      y:((this.tileY*uiSet.tileSize)+cY)
    }
  }

  placeOnMap(map: LevelMap) {
    for(let x =0 ; x < this.tileSizeX; x++){
      for(let y =0 ; y < this.tileSizeY; y++){
        map.get(this.tileX+x,this.tileY+y).setTileEntity(this);
      }
    }
  }

  removeFromMap(map: LevelMap) {
    for(let x =0 ; x < this.tileSizeX; x++){
      for(let y =0 ; y < this.tileSizeY; y++){
        map.get(this.tileX+x,this.tileY+y).removeTileEntity();
      }
    }
  }

  tryConfigValues(params){
    for(let param of params){
      if(this.config[param]){
        this[param] = this.config[param];
      }
    }
  }

  getBotTeam():BotTeam {
    return this.botTeam;
  }

  abstract draw(drawingContext: DrawingContext);
}
