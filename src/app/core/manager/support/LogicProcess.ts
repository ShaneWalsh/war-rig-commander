// can easily add more values are required for game logic.
export class LogicContext {
  constructor(){}
}

// Default class for executing some game logic.
export interface LogicProcess {

  update(logicContext:LogicContext);

}
