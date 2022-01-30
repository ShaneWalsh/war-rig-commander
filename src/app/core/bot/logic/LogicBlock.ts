import { LogicContext } from "../../manager/support/SharedContext";


export interface LogicBlock {
  getId();

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


  isComplete(logicContext: LogicContext);
  /** Should the logic block continue, so if not complete then continue */
  canContinue(logicContext: LogicContext):boolean;
  /** Set status to in progress */
  getStatus(logicContext: LogicContext);
}

/**
 * Attributes are local unless specified otherewise with shared in the name.
 */
export abstract class AbstractLogicBlock implements LogicBlock {
  protected logicId:string; // unique for each logic block.
  protected logicLoadedId:string; // has this ever been initialised before
  protected logicCompleteId:string; // utility, can be called by logic to complete the block.
  protected logicStatusId:string; // for future use, Success, Failure, N/A could be helpful for parent blocks/seq to know if the logic was blocked/or completed.
  protected logicUnblockStrategiesId:string; // for future use, when blocked the bot can try and unblock itself. LogicBlocks[]
  constructor(namePrefix) {
    // call AI here to workout more waypoints to get around obsticals?
    this.logicId = 'lbi-'+namePrefix+'-'+ Date.now();
    this.logicLoadedId = this.logicId+'-loaded';
    this.logicCompleteId = this.logicId+'-logicComplete';
    this.logicStatusId = this.logicId+'-logicStatus';
    this.logicUnblockStrategiesId = this.logicId+'-logicUnblockStrategies';
  }

  getId() { return this.logicId; }

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
    let status:LogicBlockStatus = this.getStatus(logicContext);
    if(status === LogicBlockStatus.BLOCKED){
      let strategy:LogicBlock[] = logicContext.getLocalVariableOrDefault(this.logicUnblockStrategiesId,null);
      if(strategy != null && strategy.length > 0) {
        const block = strategy[0];
        block.update(logicContext);
        if(block.isComplete(logicContext)) {
          strategy.splice(0,1);
          const strategyStatus = block.getStatus(logicContext);
          if(strategyStatus === LogicBlockStatus.SUCCESS) { // then break out of unblocking strageties, this one worked
            // TODO loop them all and clear local variables anyway.
            logicContext.removeLocalVariable(this.logicUnblockStrategiesId);
            this.unBlocked(logicContext);
          } else if(strategyStatus === LogicBlockStatus.FAILURE || strategyStatus === LogicBlockStatus.BLOCKED || strategyStatus === LogicBlockStatus.NA){ // did not succeed
            // TODO onto the next stragety, dont really need this block or condition at all.
            console.log("Should now naturally move to the next strategy")
          }
          if(strategy.length == 0 && strategyStatus !== LogicBlockStatus.SUCCESS) { // no strategies left, + last block failed?
            this.failure(logicContext);
          }
          logicContext.clearLocalVariables(block.getId()); // clean down the block that is now complete.
        }
      }
    }
    status = this.getStatus(logicContext);
    if(status === LogicBlockStatus.INPROGRESS){
      this.updateLogic(logicContext);
    }
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
  blocked(logicContext: LogicContext, defaultAns:boolean=true):boolean {
    logicContext.setLocalVariable(this.logicCompleteId,defaultAns);
    logicContext.setLocalVariable(this.logicStatusId,LogicBlockStatus.BLOCKED)
    return defaultAns;
  }
  unBlocked(logicContext: LogicContext) {
    logicContext.setLocalVariable(this.logicStatusId,LogicBlockStatus.INPROGRESS)
  }
  /** Regardless of status is the logic block over. */
  isComplete(logicContext: LogicContext):boolean{return logicContext.getLocalVariableOrDefault(this.logicCompleteId,false);}
  /** Should the logic block continue, so if not complete then continue */
  canContinue(logicContext: LogicContext):boolean { return !logicContext.getLocalVariableOrDefault(this.logicCompleteId,false);}
  /** Set status to in progress */
  inProgress(logicContext: LogicContext){ logicContext.setLocalVariable(this.logicStatusId, LogicBlockStatus.INPROGRESS)}
  getStatus(logicContext: LogicContext):LogicBlockStatus{return logicContext.getLocalVariableOrDefault(this.logicStatusId, LogicBlockStatus.INPROGRESS);}
  setStatus(logicContext: LogicContext, logicBlockStatus:LogicBlockStatus) {logicContext.setLocalVariable(this.logicStatusId, logicBlockStatus)}
}

export enum LogicBlockStatus {
  SUCCESS="SUCCESS", // ended in success
  FAILURE="FAILURE", // ended in failure
  BLOCKED="BLOCKED", // cannot continue
  INPROGRESS="INPROGRESS", // in progress as we speak.
  NA="NA", // means none of the above but also no longer required, e.g lost target. its over anyway.
}
