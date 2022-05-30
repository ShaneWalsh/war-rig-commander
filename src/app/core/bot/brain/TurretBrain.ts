import { LogicContext } from "../../manager/support/SharedContext";
import { BotBrain } from "../BotBrains";

/**
 * Look for values in the context that will trll the turret where to aim and where to shoot.
 *
 */
 export class TurretBrain implements BotBrain {

  think(logicContext:LogicContext){
    // do something turret.
  }
}
