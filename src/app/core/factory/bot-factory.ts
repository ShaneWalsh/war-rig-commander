import { LogicService } from 'src/app/services/logic.service';
import { BotMissile } from '../bot/BotMissile';
import { BulletDirection } from '../bot/rotation/BulletDirection';
import { BotCollision } from '../bot/util/BotCollision';
import { BotDamage } from '../bot/util/BotDamage';
import { Drawer } from '../manager/support/display/Drawer';
import { LogicProcess } from '../manager/support/logic/LogicProcess';
import { DrawingContext, LogicContext } from '../manager/support/SharedContext';


export class BotFactory {
  constructor() {}

  // Generic bullet for testing.
  public static createMissile(logicContext: LogicContext,x:number,y:number,tarX:number,tarY:number): Missile {
    let bd = BulletDirection.calculateBulletDirection(x,y,tarX,tarY,4,false,null);
    let missile = new Missile(x, y, 8, 8, bd);
    missile.init(logicContext);
    console.log("Create Missile", missile)
    return missile;
  }
}

class Missile implements LogicProcess, Drawer, BotMissile {
  constructor(
    public posX: number,
    public posY: number,
    public sizeX: number,
    public sizeY: number,
    public bulletDir: BulletDirection
  ) {}

  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    // TODO replace with animation at some point.
    LogicService.drawBox(this.posX - uiSet.curX,this.posY - uiSet.curY,this.sizeX,this.sizeY,dc.cc.groundCtx,'#00FFFF','#FF00FF');
  }

  init(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.addDrawer(this);
    logicContext.levelInstance.mc.logicMS.addLogicProcess(this);
  }

  update(logicContext: LogicContext) {
    this.move(logicContext);
    this.colisionDetection(logicContext);
  }

  colisionDetection(logicContext: LogicContext) {
    let tile = logicContext.levelInstance.getMap().locateTile(this.posX,this.posY);
    if(tile !== null) {
      logicContext.levelInstance.getMap().colisionDetection(logicContext, tile, this);
    } else { // left the game area. Remove.
      this.removeSelf(logicContext);
    }
  }

  collisionDamage(logicContext: LogicContext): BotDamage {
    // TODO collisionDamage
    return null;
  }

  collisionYouHit(logicContext: LogicContext) {
    // TODO add explosion? Leave a mark?
    this.removeSelf(logicContext);
  }

  collisionYouWereHit(logicContext: LogicContext, hit: BotCollision) {
    // TODO add explosion? Leave a mark?
    this.removeSelf(logicContext);
  }

  // hook
  removeSelf(logicContext: LogicContext) {
    this.destroy(logicContext);
  }

  move(logicContext: LogicContext) {
    this.bulletDir.update(this.posX, this.posY);
    this.posX += this.bulletDir.directionX*this.bulletDir.speed;
    this.posY += this.bulletDir.directionY*this.bulletDir.speed;
  }

  destroy(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.removeDrawer(this);
    logicContext.levelInstance.mc.logicMS.removeLogicProcess(this);
  }
}
