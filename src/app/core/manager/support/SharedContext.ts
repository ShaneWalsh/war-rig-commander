import { BotInstance } from "../../bot/BotInstance";
import { PathfinderService } from "../../map/pathfinder.service";
import { TileEntity } from "../../TileEntity";
import { CanvasContainer } from "./CanvasContainer";
import { LevelInstance } from "./LevelInstance";
import { UiSettings } from "./UiSettings";

export class SharedContext {
  tileEntity:TileEntity = null;
  botInstance:BotInstance = null; // purely convience reference
  private sharedVariables: Map<string,any> = new Map();

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
  getSharedVariable(variable: string):any {
    return this.sharedVariables.get(variable);
  }
  setSharedVariable(variable: string, val: any):any {
    return this.sharedVariables.set(variable, val);
  }
}

// can easily add more values are required for game logic.
export class LogicContext extends SharedContext {

  private pathfinderService: PathfinderService;

  constructor(public levelInstance:LevelInstance){
    super();
  }

  /**
   * get logic variables related to the current entity
   * @param logicVarBlockIndex
   */
  getLocalVariable(variable: string):any {
    return this.tileEntity.getLogicVariables().get(variable);
  }
  // if the local variable doesnt exist return the default value.
  getLocalVariableOrDefault(variable: string, defaultValue:any):any {
    return (this.tileEntity.getLogicVariables().has(variable)) ? this.getLocalVariable(variable):defaultValue;
  }
  setLocalVariable(variable: string, val: any):any {
    return this.tileEntity.getLogicVariables().set(variable, val);
  }
  removeLocalVariable(variable: string):boolean {
    return this.tileEntity.getLogicVariables().delete(variable);
  }

  getPathfinderService(): PathfinderService {
    return this.pathfinderService;
  }
  setPathfinderService(value: PathfinderService) {
    this.pathfinderService = value;
  }

}

// can easily add more values are required for drawing.
export class DrawingContext extends SharedContext {

  constructor(public cc:CanvasContainer, public uis:UiSettings) {
    super()
  }


}
