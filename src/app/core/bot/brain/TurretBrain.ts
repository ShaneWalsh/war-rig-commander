import { Limiter } from "../../Limiter";
import { ManagerContext } from "../../manager/support/ManagerContext";
import { LogicContext } from "../../manager/support/SharedContext";
import { TileEntity } from "../../TileEntity";
import { BotBrain } from "../BotBrains";
import { TargetFinder, TargetVariables } from "./TargetFinder";

enum TurretState {
  LOADING="LOADING",
  LOADED="LOADED",
  SHOOTING="SHOOTING",
}

/**
 * Look for values in the context that will trll the turret where to aim and where to shoot.
 *
 */
 export class TurretBrain implements BotBrain {

  firingLimiter:Limiter = null;

  constructor(
    public rateOfFire, // how often can this bad boy shoot
    public ammunitionType, // check if the bot can support this ammo, maybe its out?
    public bulletConfg // what kind of bullet is it going to fire, multi shot, interval in shots?
  ){
    this.firingLimiter = new Limiter(rateOfFire,0,1);
  }

  think(logicContext:LogicContext) {
    let mc = logicContext.levelInstance.mc;
    // do I have any nearby targets?
    this.firingLimiter.update();
    let target = logicContext.getLocalVariableOrDefault(TargetVariables.CURRENT_TARGET,null);
    if(target !== null){
      // TODO rotate to turret to face the target!
      if(this.firingLimiter.atLimit()) { // fire!
        // do we have the ammo to fire?
        // generate bullet
        this.firingLimiter.reset();
      }
    } else { // TODO then turn the turret to face back to its default rotation position.

    }

    //mc.displayMS.addDrawer();
  }
}
