import { LogicService } from "src/app/services/logic.service";
import { LogicProcess } from "../manager/support/logic/LogicProcess";
import { DrawingContext, LogicContext } from "../manager/support/SharedContext";
import { AbsTileEntity } from "../TileEntity";
import { BotAnimation } from "./util/BotAnimation";



// TODO clickable interface? So when the player clicks on the building, a new UI state is possible?
  // display unit menu, show health, next right click assigns waypoint etc

export class BotBuilding extends AbsTileEntity implements LogicProcess {

  constructor(
    config:any={}, // override defaults
    tileX:number, // which tile the bot is on (the top left one anyway)
    tileY:number,
    tileSizeX:number, // how many tiles the bot occupies in the x direction
    tileSizeY:number,
    // some kind of drawing object
    public animation:BotAnimation,
    public posX:number = tileX, // the actual current x+y cords of the bot
    public posY:number = tileY,
    // alignment? faction? player controlled?
    // group, e.g if you fire on one bot in a convoy, they will all know, and react.
  ) {
      super(config, tileX,tileY,tileSizeX,tileSizeY);
      this.tryConfigValues([""]);
  }

  init(logicContext: LogicContext) {

  }

  update(logicContext: LogicContext) {
    // after 5 seconds, spawn a new bot.
    // scenario default for the bots? For mission scripting.

  }

  destroy(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.removeDrawer(this);
    logicContext.levelInstance.mc.logicMS.removeLogicProcess(this);
    let tiles = logicContext.levelInstance.getMap().getTiles();
    tiles[this.tileX][this.tileY].removeTileEntity(); // TODO this does not handle a bot that spans multiple tiles.
  }

  draw(dc: DrawingContext) {
    const bi = dc.getBotInstance();
    const uiSet = dc.uiSet;
    LogicService.drawBox( bi.posX-uiSet.curX,
                          bi.posY-uiSet.curY,
                          32*this.tileSizeX,32 *this.tileSizeY
                          ,dc.cc.groundCtx,
                          '#eFeFeF','#FF00FF')
  }
}
