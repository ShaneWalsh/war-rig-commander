import { BotInstance } from "../../bot/BotInstance";
import { PathfinderService } from "../../map/pathfinder.service";
import { TileEntity } from "../../TileEntity";
import { CanvasContainer } from "./display/CanvasContainer";
import { LevelInstance } from "./level/LevelInstance";
import { UiSettings } from "./display/UiSettings";
import { LogicBlock } from "../../bot/logic/LogicBlock";
import { ManagerContext } from "./ManagerContext";

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
  getSharedVariableOrDefault(variable: string, defaultValue:any):any {
    return (this.sharedVariables.has(variable)) ? this.sharedVariables.get(variable):defaultValue;
  }
  setSharedVariable(variable: string, val: any):any {
    return this.sharedVariables.set(variable, val);
  }
}

// can easily add more values are required for game logic.
export class LogicContext extends SharedContext {
  // can easily add more values are required for game logic.
  private pathfinderService: PathfinderService;

  constructor(public levelInstance:LevelInstance){
    super();
  }

  getCommon():{mc:ManagerContext,bi:BotInstance}{
    return {
      mc:this.levelInstance.mc,
      bi:this.botInstance
    }
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
  // if the local variable doesnt exist then execute function and set it.
  getLocalVariableOrExec(variable: string, setFunction: () => any): any {
    return (this.tileEntity.getLogicVariables().has(variable)) ? this.getLocalVariable(variable):setFunction();
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

  clearLocalVariables(logicId: string) {
    const map = this.tileEntity.getLogicVariables();
    const matchingKeys = [...map.keys()].filter((key) => key.startsWith(logicId));
    matchingKeys.forEach(key => {
      map.delete(key);
    });
  }

}

// can easily add more values are required for drawing.
export class DrawingContext extends SharedContext {

  constructor(public cc:CanvasContainer, public uiSet:UiSettings) {
    super()
  }


}
