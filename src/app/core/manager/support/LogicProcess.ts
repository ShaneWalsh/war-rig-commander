import { BotInstance } from "../../bot/BotInstance";
import { TileEntity } from "../../TileEntity";
import { LevelInstance } from "./LevelInstance";

// can easily add more values are required for game logic.
export class LogicContext {

  private tileEntity:TileEntity = null;
  private botInstance:BotInstance = null; // purely convience reference

  constructor(public levelInstance:LevelInstance){}

  setBotInstance(botInstance:BotInstance){
    this.tileEntity = botInstance;
    this.botInstance = botInstance;
  }
  clearBotInstance(){
    this.tileEntity = null;
    this.botInstance = null;
  }
  getBotInstance():BotInstance {
    return this.botInstance;
  }

  /**
   * get logic variables related to the current entity
   * @param logicVarBlockIndex
   */
  getLogicVariable(variable: string):any {
    return this.tileEntity.getLogicVariables().get(variable);
  }
  setLogicVariable(variable: string, val: any):any {
    return this.tileEntity.getLogicVariables().set(variable, val);
  }

}

// Default class for executing some game logic.
export interface LogicProcess {

  update(logicContext:LogicContext);

}
