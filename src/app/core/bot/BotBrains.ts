
import { LogicContext } from "../manager/support/SharedContext";

/**
 * Some kind of action this bot should do.
 */
export interface BotBrain {
  think(logicContext:LogicContext);
}

