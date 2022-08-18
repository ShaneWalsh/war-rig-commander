import { Injectable } from '@angular/core';
import { LogicService } from 'src/app/services/logic.service';
import { BulletDirection } from '../bot/rotation/BulletDirection';
import { Drawer } from '../manager/support/display/Drawer';
import { LogicProcess } from '../manager/support/logic/LogicProcess';
import { DrawingContext, LogicContext } from '../manager/support/SharedContext';

/**
 * Factory methods for all of the bots in the game.
 */
@Injectable({
  providedIn: 'root',
})
export class BotFactoryService {
  constructor() {}

  // Generic bullet for testing.
  public static createMissile(logicContext: LogicContext,x:number,y:number,tarX:number,tarY:number): Missile {
    let bd = BulletDirection.calculateBulletDirection(x,y,tarX,tarY,50,false,null);
    let missile = new Missile(x, y, 8, 8, bd);
    missile.init(logicContext);
    console.log("Create Missile", missile)
    return missile;
  }
}

class Missile implements LogicProcess, Drawer {
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
    LogicService.drawBox(
      this.posX - uiSet.curX,
      this.posY - uiSet.curY,
      this.sizeX,
      this.sizeY,
      dc.cc.groundCtx,
      '#00FFFF',
      '#FF00FF'
    );
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
      // TODO check tile entity hitbox for colision.
        // trigger collision between the two. this-hitting-other.
    } else {
      this.removeSelf(logicContext);
    }
  }

  // hook
  removeSelf(logicContext: LogicContext) {
    this.destroy(logicContext);
  }



  move(logicContext: LogicContext) {
    this.bulletDir.update(this.posX, this.posY);
    this.posX += this.bulletDir.directionX;
    this.posY += this.bulletDir.directionY;
  }

  destroy(logicContext: LogicContext) {
    logicContext.levelInstance.mc.displayMS.removeDrawer(this);
    logicContext.levelInstance.mc.logicMS.removeLogicProcess(this);
  }
}
