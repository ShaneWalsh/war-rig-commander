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
  constructor(namePrefix) {
    // call AI here to workout more waypoints to get around obsticals?
    this.logicId = 'lbi-'+namePrefix+'-'+ Date.now();
    this.logicLoadedId = this.logicId+'-Loaded';

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
  abstract update(logicContext: LogicContext): boolean;
  /**
   * Called whenever a logic block was disused and then returned to for a specific entity.
   * Can clear down shared or local variables that wont survive the context swtich.
   * @param logicContext
   */
  abstract reload(logicContext: LogicContext);
}

