import { Drawer } from "./manager/support/display/Drawer";
import { DrawingContext } from "./manager/support/SharedContext";

export enum EntityState {
  // Sensors
  TrackingUnknown='TrackingUnknown',
  TrackingEnemy='TrackingEnemy',

  // Combat
  UnderAttack='UnderAttack', // this entity is being fired upon
  Attacking='Attacking', // this entity is attacking something else
  Damaged='Damaged', // this entity has been damaged
  Destroyed='Destroyed', // this entity has been destroyed, 0hp
  BeingRepairing='BeingRepairing',
  Repairing='Repairing',

  // Movement
  Walking='Walking',
  Running='Running',

  // Actions ?

}

/**
 * Anything than exists on a tile and is not just background. Unit, building etc
 */
 export interface TileEntity extends Drawer {
  isPassable():boolean;
  toggleState(entityState:EntityState);
  setState(entityState: EntityState, bool:boolean);
  getState(entityState:EntityState):boolean;
  getStates():Map<EntityState,boolean>;
  getLogicVariables():Map<string,any>;
}

export abstract class AbsTileEntity implements TileEntity {
  private states:Map<EntityState,boolean> = new Map();
  private logicVariables:Map<string,any> = new Map();

  isPassable(): boolean {
    return false;
  }

  /** Filps the current value of a state or sets it to true if its never been set */
  toggleState(entityState: EntityState) {
    if(this.states.has(entityState)) {
      this.states.set(entityState,!this.states.get(entityState));
    } else {
      this.states.set(entityState, true);
    }
  }
  setState(entityState: EntityState, bool:boolean) {
    this.states.set(entityState, bool);
  }
  getState(entityState: EntityState): boolean {
    if(this.states.has(entityState))
      return this.states.get(entityState);
    else return false;
  }
  getStates(): Map<EntityState,boolean> {
    return this.states;
  }

  getLogicVariables(): Map<string, any> {
    return this.logicVariables;
  }

  abstract draw(drawingContext: DrawingContext);
}
