

import { LogicContext } from "../../manager/support/SharedContext";
import { Opt } from "../../Opt";
import { EntityState, TileEntity } from "../../TileEntity";

export interface LogicCondition {
  checkCondition(logicContext:LogicContext):boolean;
}

// #################
// # DecisionLogic #
// #################

export class AndCondition implements LogicCondition {
  constructor(public conditions:LogicCondition[]){}
  checkCondition(logicContext:LogicContext): boolean {
    for(let i = 0; i < this.conditions.length; i++){
      if(!this.conditions[i].checkCondition(logicContext)){
        return false;
      }
    }
    return true;
  }
}

export class OrCondition implements LogicCondition {
  constructor(public conditions:LogicCondition[]){}
  checkCondition(logicContext:LogicContext): boolean {
    for(let i = 0; i < this.conditions.length; i++){
      if(this.conditions[i].checkCondition(logicContext)){
        return true;
      }
    }
    return false;
  }
}

export class NotCondition implements LogicCondition {
  constructor(public condition:LogicCondition){}
  checkCondition(logicContext:LogicContext): boolean {
    return !this.condition.checkCondition(logicContext);
  }
}

// #################
// ##### State #####
// #################

export class StateActiveCondition implements LogicCondition {
  constructor(public state:EntityState, public target: TileEntity){}
  checkCondition(logicContext:LogicContext): boolean {
    return this.target.getState(this.state);
  }
}

export class StateInactiveCondition implements LogicCondition {
  constructor(public state:EntityState, public target: TileEntity){}
  checkCondition(logicContext:LogicContext): boolean {
    return !this.target.getState(this.state);
  }
}

// #################
// #### Numbers ####
// #################

// distance/range
//

export class LocalVariableSetCondition implements LogicCondition {
  constructor(public variableName: string){}
  checkCondition(lc:LogicContext): boolean {
    let v= lc.getLocalVariableOrDefault(this.variableName,null);
    return (v === null || (v instanceof Opt && !v.isPresent()))? false : true;
  }
}

export class LocalVariableNotSetCondition implements LogicCondition {
  constructor(public variableName: string){}
  checkCondition(lc:LogicContext): boolean {
    let v= lc.getLocalVariableOrDefault(this.variableName,null);
    return (v === null || (v instanceof Opt && !v.isPresent()))? true : false;
  }
}


