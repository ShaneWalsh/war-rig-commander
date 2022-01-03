import { Injectable } from '@angular/core';
import { LogicContext, LogicProcess } from './support/LogicProcess';


/**
 * Organise and execute the game logic for each tick
 * All of the logic should be done by the individual logic process.
 */

@Injectable({
  providedIn: 'root'
})
export class LogicManagerService {

  /**
   * Temporary process that only runs for a set time before removing itself.
   */
  private tempLogicProcesses: LogicProcess[] = [];
  /**
   * Long lived processes that can run indefinitely
   */
  private logicProcesses: LogicProcess[] = [];

  constructor() { }

  public update() {
    const logicContext = new LogicContext();
    this.logicProcesses.forEach( logicProcess => {
      logicProcess.update(logicContext);
    });
  }

  // #################
  // #### GET SET ####
  // #################

  public setLogicProcesses(logicProcesses:LogicProcess[]){
    this.logicProcesses = logicProcesses;
  }

  public addLogicProcess(logicProcess:LogicProcess) {
    this.logicProcesses.push(logicProcess);
  }

  public removeLogicProcess(logicProcess:LogicProcess) {
    this.logicProcesses.splice(this.logicProcesses.indexOf(logicProcess));
  }

  // #################
  // #### Utility ####
  // #################

}
