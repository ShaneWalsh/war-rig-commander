import { Injectable } from '@angular/core';
import { PathfinderService } from 'src/app/core/map/pathfinder.service';
import { LevelInstance } from './support/level/LevelInstance';
import { LogicProcess } from './support/logic/LogicProcess';
import { LogicContext } from './support/SharedContext';


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
  private logicContext;

  constructor(private pathfinderService:PathfinderService) { }

  public update(levelInstance:LevelInstance) {
    this.logicContext.setPathfinderService(this.pathfinderService);
    const processes = [...this.logicProcesses]; // TODO performance analysis? Issue is how to remove processes that end without affecting the loop. Destroyed or consumed?
    processes.forEach( logicProcess => {
      logicProcess.update(this.logicContext);
    });
  }

  // #################
  // #### GET SET ####
  // #################

  public createContextForLevel(levelInstance){
    this.logicContext = new LogicContext(levelInstance);
  }

  public setLogicProcesses(logicProcesses:LogicProcess[]){
    this.logicProcesses = logicProcesses;
  }

  public addLogicProcess(logicProcess:LogicProcess) {
    this.logicProcesses.push(logicProcess);
  }

  public removeLogicProcess(logicProcess:LogicProcess) {
    const index = this.logicProcesses.indexOf(logicProcess);
    if(index > -1){
      this.logicProcesses.splice(this.logicProcesses.indexOf(logicProcess));
    }
  }

  /**
   * Called by a running process, will be removed after all processes are finished.
   * TODO determine if this is required?
   * @param logicProcess
   */
  public safelyRemoveLogicProcess(logicProcess:LogicProcess) {
    // TODO logic
  }

  // #################
  // #### Utility ####
  // #################

}
