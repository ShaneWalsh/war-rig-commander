import { LogicContext } from "../../manager/support/SharedContext";
import { BotBrain } from "../BotBrains";

export enum TargetVariables {
  AVAILABLE_TARGETS="AVAILABLE_TARGETS",
  CLOSEST_TARGET="CLOSEST_TARGET",
  NETWORKED_ALLIES="NETWORKED_ALLIES",
}

/**
 * Find a target, if there is one already, is it still a valid target?
 * If not, find a new one.
 * Hav secific logic variables it can set and maintain in the context? Put them in as Enums?
 */
 export class TargetFinder implements BotBrain {

  think(logicContext:LogicContext){
    // do something turret.
  }
}
