import { BotFactoryService } from "../../factory/bot-factory.service";
import { Limiter } from "../../Limiter";
import { ManagerContext } from "../../manager/support/ManagerContext";
import { LogicContext } from "../../manager/support/SharedContext";
import { TileEntity } from "../../TileEntity";
import { BotBrain } from "../BotBrains";
import { BotInstance } from "../BotInstance";
import { TargetFinder, TargetVariables } from "./TargetFinder";

enum TurretState {
  LOADING="LOADING",
  LOADED="LOADED",
  SHOOTING="SHOOTING",
}

/**
 * Look for values in the context that will trll the turret where to aim and where to shoot.
 * TODO extract weapons, they should be on the turret itself, potentially multiple turrets.
 */
 export class TurretBrain implements BotBrain {

   id:string;
   firingLimiterVarId: string;

   constructor(
     public rateOfFire, // how often can this bad boy shoot
     public ammunitionType, // check if the bot can support this ammo, maybe its out?
     public bulletConfg // what kind of bullet is it going to fire, multi shot, interval in shots?
     ){
       this.id = 'TurretBrain-'+Date.now();
       this.firingLimiterVarId = this.id +'-firingLimiter';
      }

  think(logicContext:LogicContext) {
    let {mc, bi} = logicContext.getCommon();
    // this.firingLimiter =
    let firingLimiter:Limiter = logicContext.getLocalVariableOrExec(this.firingLimiterVarId,() => this.createLimiter())
    // do I have any nearby targets?
    firingLimiter.update();
    let target = logicContext.getLocalVariableOrDefault(TargetVariables.CURRENT_TARGET,null);
    if(target !== null) {
      // TODO rotate to turret to face the target before firing!
      if(firingLimiter.atLimit()) { // fire!
        // do we have the ammo to fire?
        // generate bullet
        BotFactoryService.createMissile(logicContext, bi.posX, bi.posY,target.posX, target.posY);
        firingLimiter.reset();
      }
    } else { // TODO then turn the turret to face back to its default rotation position after a time limit...

    }
    logicContext.setLocalVariable(this.firingLimiterVarId, firingLimiter);
  }

  createLimiter(){
    return new Limiter(this.rateOfFire,0,1);
  }
}
