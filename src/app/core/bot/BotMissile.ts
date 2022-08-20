import { LogicContext } from "../manager/support/SharedContext"
import { BotCollision } from "./util/BotCollision";

export interface BotMissile extends BotCollision {

  /**
   * Move the missile
   */
  move(logicContext: LogicContext);

  /**
   * Execute Colision Detection after moving
   */
  colisionDetection(logicContext: LogicContext);

  /**
   * Silently remove the missile, no bells and whisles
   * Maybe its outside the bounds of the game map.
   */
  removeSelf(logicContext: LogicContext);


}
