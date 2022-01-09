import { LogicContext } from "./SharedContext";

// Default class for executing some game logic.
export interface LogicProcess {

  update(logicContext:LogicContext);

}
