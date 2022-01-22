import { LogicContext } from "../SharedContext";

// Default class for executing some game logic.
export interface LogicProcess {

  /**
   * Setup up anything logic process requires.
   */
  init(logicContext:LogicContext);

  /**
   * Update process
   */
  update(logicContext:LogicContext);

  /**
   * Clean up after logic process is removed from the engine
   */
  destroy(logicContext:LogicContext);
}
