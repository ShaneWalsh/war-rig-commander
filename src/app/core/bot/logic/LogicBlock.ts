import { LogicContext } from "../../manager/support/SharedContext";


export interface LogicBlock {

  /**
   * Called once, when the logic block is first used.
   * @param logicContext
   */
  load(logicContext:LogicContext);

  /**
   *
   * @param logicContext
   * returns true when the logic is complete. Move to point. false for a endless block, Sentry/Patrol.
   */
  update(logicContext:LogicContext):boolean;

}

/**
 * Attributes are local unless specified otherewise with shared in the name.
 */
export abstract class AbstractLogicBlock implements LogicBlock {
  protected logicId:string; // unique for each logic block.
  protected logicLoadedId:string; // has this ever been initialised before
  protected logicCompleteId:string; // utility, can be called by logic to complete the block.
  protected logicStatusId:string; // for future use, Success, Failure, N/A could be helpful for parent blocks/seq to know if the logic was blocked/or completed.
  constructor(namePrefix) {
    // call AI here to workout more waypoints to get around obsticals?
    this.logicId = 'lbi-'+namePrefix+'-'+ Date.now();
    this.logicLoadedId = this.logicId+'-loaded';
    this.logicCompleteId = this.logicId+'-logicComplete';
    this.logicStatusId = this.logicId+'-logicStatus';
  }

  load(logicContext: LogicContext) {
    if(!logicContext.getLocalVariableOrDefault(this.logicLoadedId,false)){
      this.firstLoad(logicContext);
      logicContext.setLocalVariable(this.logicLoadedId,true);
    } else {
      this.reload(logicContext);
    }
  }

  /**
   * Called the first time this block is loaded for this entity
   * @param logicContext
   */
  abstract firstLoad(logicContext: LogicContext);
  update(logicContext: LogicContext): boolean {
    this.updateLogic(logicContext);
    return this.isComplete(logicContext);
  }
  abstract updateLogic(logicContext: LogicContext);
  /**
   * Called whenever a logic block was disused and then returned to for a specific entity.
   * Can clear down shared or local variables that wont survive the context swtich.
   * @param logicContext
   */
  abstract reload(logicContext: LogicContext);

  /**
   * Utility functions to mark a logic block as complete and set status.
   */
  complete(logicContext: LogicContext):boolean {
    logicContext.setLocalVariable(this.logicCompleteId,true);
    logicContext.setLocalVariable(this.logicStatusId,LogicBlockStatus.SUCCESS)
    return true;
  }
  failure(logicContext: LogicContext):boolean {
    logicContext.setLocalVariable(this.logicCompleteId,true);
    logicContext.setLocalVariable(this.logicStatusId,LogicBlockStatus.FAILURE)
    return true;
  }
  blocked(logicContext: LogicContext):boolean {
    logicContext.setLocalVariable(this.logicCompleteId,true);
    logicContext.setLocalVariable(this.logicStatusId,LogicBlockStatus.BLOCKED)
    return true;
  }
  isComplete(logicContext: LogicContext, defaultAns:boolean=false):boolean{
    return logicContext.getLocalVariableOrDefault(this.logicCompleteId,defaultAns);
  }
  /** Should the logic block continue */
  continue(logicContext: LogicContext):boolean{
    return !logicContext.getLocalVariableOrDefault(this.logicCompleteId,false);
  }
}

export enum LogicBlockStatus {
  SUCCESS="SUCCESS",
  FAILURE="FAILURE",
  BLOCKED="BLOCKED",
  NA="NA", // means none of the above but also no longer required, e.g lost target.
}
