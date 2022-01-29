import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { AbstractLogicBlock } from "../LogicBlock";

export class SentryLogic extends AbstractLogicBlock {
  firstLoad(logicContext: LogicContext) {

  }
  updateLogic(logicContext: LogicContext) {
    return false;
  }
  reload(logicContext: LogicContext) {

  }

}
