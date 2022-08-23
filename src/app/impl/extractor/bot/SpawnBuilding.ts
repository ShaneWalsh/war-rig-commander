

import { BotBuilding } from "src/app/core/bot/BotBuilding";
import { BotInstance } from "src/app/core/bot/BotInstance";
import { BotTeam } from "src/app/core/bot/BotTeam";
import { BotAnimation } from "src/app/core/bot/util/BotAnimation";
import { Cords } from "src/app/core/Cords";
import { Limiter } from "src/app/core/Limiter";
import { DrawingContext, LogicContext } from "src/app/core/manager/support/SharedContext";
import { AbsTileEntity } from "src/app/core/TileEntity";
import { LogicService } from "src/app/services/logic.service";

// TODO clickable interface? So when the player clicks on the building, a new UI state is possible?
// display unit menu, show health, next right click assigns waypoint etc

export class SpawnBuilding extends AbsTileEntity implements BotBuilding {

  spawnLimiter:Limiter;

  constructor(
    config:any={}, // override defaults
    tileX:number, // which tile the bot is on (the top left one anyway)
    tileY:number,
    tileSizeX:number, // how many tiles the bot occupies in the x direction
    tileSizeY:number,
    // some kind of drawing object
    // public animation:BotAnimation,
    public posX:number = tileX, // the actual current x+y cords of the bot
    public posY:number = tileY,
    public botTeam:BotTeam,
    public spawnFunction:Function,
    public spawnTime: number,
    public spawnDefaultLocation:any
    // group, e.g if you fire on one bot in a convoy, they will all know, and react.
  ) {
      super(config, tileX,tileY,tileSizeX,tileSizeY);
      this.tryConfigValues([""]);
      this.spawnLimiter = new Limiter(this.spawnTime,0,1);
  }

  init(logicContext: LogicContext) {

  }

  update(logicContext: LogicContext) {
    // spawn on a loop
    if(this.spawnLimiter.update()){
      // Poop it out a tile below the building
      let cords = this.findSpawnLocation(logicContext);
      // execute spwan function parameter, returns a botInstance?
      let bi:BotInstance = this.spawnFunction(logicContext,cords);
      this.spawnLimiter.reset();
      // TODO move this into the Bot creation somehow
      logicContext.levelInstance.mc.logicMS.addLogicProcess(bi);
      logicContext.levelInstance.getMap().get(bi.tileX,bi.tileY).setTileEntity(bi);
    }
  }

  // like below or above as the priority, failing that it will fallback to any free tile, else queue the entity.
  findSpawnLocation(logicContext: LogicContext):Cords {
    return new Cords(this.tileX+1,this.tileY+3);
  }

  destroy(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.removeDrawer(this);
    logicContext.levelInstance.mc.logicMS.removeLogicProcess(this);
    let tiles = logicContext.levelInstance.getMap().getTiles();
    tiles[this.tileX][this.tileY].removeTileEntity(); // TODO this does not handle a bot that spans multiple tiles.
  }

  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    LogicService.drawBox( this.posX-uiSet.curX,
                          this.posY-uiSet.curY,
                          32*this.tileSizeX,32 *this.tileSizeY
                          ,dc.cc.groundCtx,
                          '#eFeFeF','#FF00FF')
  }
}
