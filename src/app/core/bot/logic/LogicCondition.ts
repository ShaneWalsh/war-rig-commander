
// CONDITIONS

import { LogicContext } from "../../manager/support/LogicProcess";
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
