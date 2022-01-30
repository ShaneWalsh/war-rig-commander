import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { LogicService } from "src/app/services/logic.service";
import { AbstractLogicBlock } from "../LogicBlock";


export class WaitLogic extends AbstractLogicBlock {

  protected waitCounterVarId = this.logicId+'-waitCounter';

  constructor(public waitTicks:number=120, public breakWaitEarly:any=null, public doWhileWaiting:any=null) {
    super("Wait");
  }

  firstLoad(logicContext: LogicContext) {
  }
  updateLogic(logicContext: LogicContext) {
    if(this.breakWaitEarly != null) { // callback to break free from the loop.
      if(this.breakWaitEarly(logicContext)){
        this.complete(logicContext);
        return;
      }
    }
    if(this.doWhileWaiting != null){
      this.doWhileWaiting(logicContext);
    }
    let waitCounter = logicContext.getLocalVariableOrDefault(this.waitCounterVarId, 0);
    waitCounter = LogicService.incrementLoop(waitCounter, this.waitTicks);
    if(waitCounter == 0) { // we have gone full circle
      if(this.breakWaitEarly != null)
        this.failure(logicContext); // we failed to break out of the wait
      else
        this.complete(logicContext); // we successfully waited
    } else {
      logicContext.setLocalVariable(this.waitCounterVarId, waitCounter);
    }
  }
  reload(logicContext: LogicContext) {
  }

}
