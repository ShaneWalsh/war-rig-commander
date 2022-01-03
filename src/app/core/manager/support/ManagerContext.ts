import { DisplayManagerService } from "../display-manager.service";
import { LevelManagerService } from "../level-manager.service";
import { LogicManagerService } from "../logic-manager.service";

/**
 * All of the managers required for wiring the game togeather
 */
export class ManagerContext {

  constructor(public levelManagerService:LevelManagerService, public logicManagerService:LogicManagerService, public displayManagerService:DisplayManagerService){

  }

}
