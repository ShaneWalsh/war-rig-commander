import { ManagerContext } from "../ManagerContext";
import { LogicContext } from "../SharedContext";

// Default class for executing some game logic.
export interface LogicProcess {

  // register this process with logic engine.
  // TODO register(mc:ManagerContext);

  /**
   * Setup up anything logic process requires.
   * Create Subscriptions
   */
  init(logicContext:LogicContext);

  /**
   * Update process
   */
  update(logicContext:LogicContext);

  /**
   * Clean up after logic process is removed from the engine
   * Cancel Subscriptions
   */
  destroy(logicContext:LogicContext);
}
