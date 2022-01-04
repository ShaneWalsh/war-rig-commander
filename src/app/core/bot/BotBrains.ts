import { LogicContext } from "../manager/support/LogicProcess";
import { BotInstance } from "./BotInstance";

/**
 * Some kind of action this bot should do.
 */
export interface BotBrain {
  update(botInstance:BotInstance, logicContext:LogicContext);
}

