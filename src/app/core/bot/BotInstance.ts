import { Drawer } from "../manager/support/display/Drawer";
import { LogicProcess } from "../manager/support/logic/LogicProcess";
import { DrawingContext, LogicContext } from "../manager/support/SharedContext";
import { LevelMap } from "../map/LevelMap";
import { AbsTileEntity, TileEntity } from "../TileEntity";
import { BotBrain } from "./BotBrains";
import { BotGoal } from "./BotGoal";
import { BotPart } from "./BotPart";
import { BotTeam } from "./BotTeam";
import { BotCollision } from "./util/BotCollision";
import { BotDamage } from "./util/BotDamage";

/**
 * Default bot
 * They should auto Attack when they are attack and slow their pace to fire accurately.
 * Can force move them, they will run full speed and not shoot. (feat to move full speed and shoot)
 *
 * Goals, e.g defend location, move to location, attack target, capture target
 *
 *
 */
export class BotInstance extends AbsTileEntity implements Drawer, LogicProcess, TileEntity, BotCollision {
  // A turret would implement all 3 for example, and may have multiple weapons.
  private botWeapon:any[] = []; // todo weapons, range, damage, health, amno type etc
  private botBrains:BotBrain[] = []; // anything with logic, rotating, moving
  private botParts:BotPart[] = []; // anything that draws on the bot.

  private botGoal:BotGoal; //primary brain for moving, deciding where to go, what to do. Not Sensos or guns etc
  // speed?

  constructor(
      config:any={}, // override defaults
      botTeam:BotTeam,
      tileX:number, // which tile the bot is on (the top left one anyway)
      tileY:number,
      tileSizeX:number, // how many tiles the bot occupies in the x direction
      tileSizeY:number,
      // some kind of drawing object
      public posX:number = tileX, // the actual current x+y cords of the bot
      public posY:number = tileY,
      // alignment? faction? player controlled?
      // group, e.g if you fire on one bot in a convoy, they will all know, and react.
    ) {
      super(config,botTeam,tileX,tileY,tileSizeX,tileSizeY);
      this.tryConfigValues(["bTimer"]);
  }

  init(lc: LogicContext) {
    lc.levelInstance.mc.displayMS.addDrawer(this);
    lc.levelInstance.mc.logicMS.addLogicProcess(this);
    this.placeOnMap(lc.levelInstance.getMap());
  }

  destroy(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.removeDrawer(this);
    logicContext.levelInstance.mc.logicMS.removeLogicProcess(this);
    this.removeFromMap(logicContext.levelInstance.getMap());
  }

  collisionDamage(logicContext: LogicContext): BotDamage {
    throw new Error("Method not implemented.");
  }
  collisionYouHit(logicContext: LogicContext, hit: BotCollision) {
    throw new Error("Method not implemented.");
  }
  collisionYouWereHit(logicContext: LogicContext, hit: BotCollision) {
    this.destroy(logicContext);
  }

  update(logicContext: LogicContext) {
    logicContext.setBotInstance(this);
    this.botGoal.update(logicContext); // this will move the body, so its the most important, should go first.
    this.botBrains.forEach(botBrain => {
      botBrain.think(logicContext);
    });
    // update goal ( move(waypoints), guard(stay within a certain range, unless under attack), escort, attack(move to within range), capture, load, unload, lay )
    logicContext.clearBotInstance();
  }

  draw(drawingContext: DrawingContext) {
    drawingContext.setBotInstance(this);
    this.botParts.forEach(botPart => {
      botPart.draw(drawingContext);
    });
    // draw base
    // draw extras
    // draw turret
    drawingContext.clearBotInstance();
  }

  // TODO come back to these calcualtions when using images etc Does tile size matter?
  getCenterX():number {
    return this.posX+(16);
  }

  getCenterY():number {
    return this.posY+(16);
  }

  // TODO how to factor in the tile size?
  getTopLeftTileCenterCords():{x:number,y:number} {
    return {x:this.posX+(16), y:this.posY+(16)};
  }

  setGoal(botGoal:BotGoal) {
    this.botGoal = botGoal;
  }

  addBrain(botBrain:BotBrain){
    this.botBrains.push(botBrain);
  }

  addPart(botPart:BotPart){
    this.botParts.push(botPart);
  }

  setBotTeam(botTeam:BotTeam) {
    this.botTeam = botTeam;
  }

  getSpeed():number {
    return 4;
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
