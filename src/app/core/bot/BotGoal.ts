import { LogicService } from "src/app/services/logic.service";
import { LogicContext } from "../manager/support/SharedContext";
import { LogicBlock } from "./logic/LogicBlock";
import { LogicCondition } from "./logic/LogicCondition";


/*
The bot will consume and produce events.
  e.g
    When its in combat
    When its damaged
    When something is in range
    When something is damaged
    When something is destroyed
  When these happen, they will be checked againist the bots current goal systems, they may change the behaviour.
*/

// When - conditions - LogicBlock
// Logic makes the decisions, actually does some action
// Conditions simply move between LogicBlocks so the right one is active.

/*
Patrol: from a-z
  When - attacked - pursue

Pursue: get into firing range and stay there
  When - targetless - complete

Pursue: CUSTOM
  When - targetless - complete
  When - health < 50% - CUSTOM Sequence (Move to Point, then Patrol)

*/

export class LogicScenario {
  constructor(
    public seq:LogicSequence,
    public possibleScenarios:{con:LogicCondition,scen:LogicScenario}[],
    public clearSeqVariablesOnLoad:boolean = true,
  ){}

  update(logicContext:LogicContext):boolean {
    return this.seq.update(logicContext);
  }

  /**
   * Will be called before the scenario is used by an entity, can do any prep, clear variables.
   * @param logicContext
   */
  loadScenario(logicContext:LogicContext){
    this.seq.loadSequence(logicContext,this.clearSeqVariablesOnLoad);
  }

  checkScenario(logicContext:LogicContext):LogicScenario {
    for(let i = 0; i < this.possibleScenarios.length; i++) {
      const possibleScenario = this.possibleScenarios[i];
      if(possibleScenario.con.checkCondition(logicContext)){
        possibleScenario.scen.loadScenario(logicContext);
        return possibleScenario.scen;
      }
    }
    return this;
  }
}

export class LogicSequence {
  private logicSequenceId:string;
  private logicVarBlockIndexId:string;

  constructor (
    public logicBlocks:LogicBlock[],
    public loopBlocks:boolean=false,
    public clearVariables:boolean=false,
  ) {
    this.logicSequenceId = 'lsi-'+ Date.now();
    this.logicVarBlockIndexId = this.logicSequenceId+'-blockIndex'
  }

  update(logicContext: LogicContext):boolean {
    let logicVarBlockIndex = logicContext.getLocalVariable(this.logicVarBlockIndexId);
    if( logicVarBlockIndex === undefined || logicVarBlockIndex === null ) {
      logicVarBlockIndex = 0;
    }

    // execute block logic and if complete update index
    const block = this.logicBlocks[logicVarBlockIndex];
    if(block.update(logicContext)) {
      if( (logicVarBlockIndex+1) === this.logicBlocks.length && !this.logicBlocks){
        return true; // Scenario complete
      } else {
        logicVarBlockIndex = LogicService.incrementLoop(logicVarBlockIndex,this.logicBlocks.length);
      }
    }

    // the logic index may have changed, so always set it again
    logicContext.setLocalVariable(this.logicVarBlockIndexId, logicVarBlockIndex);
    return false;
  }

  loadSequence(logicContext: LogicContext, clearSequence:boolean) {
    if(clearSequence || this.clearVariables) {
      // TODO loop on the map, find keys that start with logicSequenceId and remove them?
      // TODO pass the seqId down to the logicBlocks so they can set variables as well?
      // TODO set the seqID into the logicContext?
    }
    this.logicBlocks.forEach(lb => {
      lb.load(logicContext);
    })
  }
}

export interface BotGoal {
  update(logicContext:LogicContext);
}

export class BotGoalSimple implements BotGoal {
  goalId: string;
  goalLoadedVarId: string;

  constructor (
    public currentGoal:LogicScenario,
    public defaultGoal:LogicScenario, // fallback to somekind of endless scenario if everything is complete, like a sentry mode.
    ) {
    this.goalId = 'goal-'+ Date.now();
    this.goalLoadedVarId = this.goalId+'-Loaded';
  }

  update(logicContext:LogicContext) {
    if(!logicContext.getLocalVariableOrDefault(this.goalLoadedVarId,false)){
      this.currentGoal.loadScenario(logicContext);
      logicContext.setLocalVariable(this.goalLoadedVarId,true);
    }
    this.currentGoal = this.currentGoal.checkScenario(logicContext);
    if(this.currentGoal.update(logicContext)){
      this.currentGoal = this.defaultGoal;
      this.currentGoal.loadScenario(logicContext);
    }
  }

}
