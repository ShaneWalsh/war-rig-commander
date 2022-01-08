import { Drawer, DrawingContext } from "../manager/support/Drawer";
import { LogicContext, LogicProcess } from "../manager/support/LogicProcess";
import { AbsTileEntity, EntityState, TileEntity } from "../TileEntity";
import { BotBrain } from "./BotBrains";
import { BotPart } from "./BotPart";

/**
 * Default bot
 * They should auto Attack when they are attack and slow their pace to fire accurately.
 * Can force move them, they will run full speed and not shoot. (feat to move full speed and shoot)
 *
 * Goals, e.g defend location, move to location, attack target, capture target
 *
 *
 */
export class BotInstance extends AbsTileEntity implements Drawer, LogicProcess, TileEntity {
  // A turret would implement all 3 for example, and may have multiple weapons.
  private botWeapon:any[] = []; // todo weapons, range, damage, health, amno type etc
  private botBrains:BotBrain[] = []; // anything with logic, rotating, moving
  private botParts:BotPart[] = []; // anything that draws on the bot.

  // speed?

  constructor(
      public config:any={}, // override defaults
      public tileX:number, // which tile the bot is on (the top left one anyway)
      public tileY:number,
      public tileSizeX:number, // how many tiles the bot occupies in the x direction
      public tileSizeY:number,
      // some kind of drawing object
      public posX:number = tileX, // the actual current x+y cords of the bot
      public posY:number = tileY,
      // alignment? faction? player controlled?
      // group, e.g if you fire on one bot in a convoy, they will all know, and react.
    ) {
      super();
      this.tryConfigValues(this.config);
  }


  update(logicContext: LogicContext) {
    this.botBrains.forEach(botBrain => {
      botBrain.update(this,logicContext);
    });
    // update goal ( move(waypoints), guard(stay within a certain range, unless under attack), escort, attack(move to within range), capture, load, unload, lay )
    // range?
    // update brains ( turret? )
  }

  draw(drawingContext: DrawingContext) {
    this.botParts.forEach(botPart => {
      botPart.draw(this,drawingContext);
    });
    // draw base
    // draw extras
    // draw turret
  }

  getSpeed():number {
    return 4;
  }

  tryConfigValues(params){
    for(let param of params){
      if(this.config[param]){
        this[param] = this.config[param];
      }
    }
  }
}



/**
 * Planned bots
 *
 * Units, can disembark from vehicles, can capture points. Can occupy unoccupied vehicles. NOT RIGS.
 * APC, Tank, Missile Launcher, Apache, Unit Copter, vehicle Copter, Rigs, Turrets.
 * Mine layer, Mine Sweeper
 * Trains, Transport trucks,
 */

/**
 * Targetting note
 *
 * We can maintain which maptile bots are in, so they occupy it, blocking another bot from entering it
 * Can use it for targetting, check all of the tiles between two bots, if there is a blockage, then we cannot shoot.
 *
 */
