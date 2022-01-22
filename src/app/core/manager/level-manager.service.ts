import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MouseService } from 'src/app/services/mouse.service';
import { KeyboardEventService } from '../../services/keyboard-event.service';
import { BotGoalSimple } from '../bot/BotGoal';
import { BotInstance } from '../bot/BotInstance';
import { DrawTestBotPart } from '../bot/BotPart';
import { LogicFactoryService } from '../factory/logic-factory.service';
import { LevelMap } from '../map/LevelMap';
import { Drawer } from './support/display/Drawer';
import { LevelInstance } from './support/level/LevelInstance';
import { LogicProcess } from './support/logic/LogicProcess';
import { ManagerContext } from './support/ManagerContext';
import { DrawingContext, LogicContext } from './support/SharedContext';

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {
  private gameTickSubject: Subject<boolean> = new Subject();
  private levelLoaded: Subject<LevelInstance> = new Subject();
  private levelComplete: Subject<LevelInstance> = new Subject();

  private currentLevel: LevelInstance;

  private paused = false;

  constructor(private keyboardEventService: KeyboardEventService) {
    keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
      if (this.getNotPaused()){
          //this.currentLevel.processKeyDown(customKeyboardEvent);
      }
    });
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
      if (this.getNotPaused()){
        //this.currentLevel.processKeyUp(customKeyboardEvent);
      }
    });
    MouseService.leftClickSubject$.subscribe(leftClick => {
      if (this.getNotPaused()){
        //this.currentLevel.leftClick(leftClick);
      }
    });
  }

  initLevel(code,managerContext:ManagerContext) {
    this.paused = true;
    if(code === "TEST"){
      this.currentLevel = new TestLevel(managerContext);
    }
  }

  update(){

  }

  pauseGame() {
      this.paused = true;
      // this.audioServiceService.stopAllAudio();
  }

  unPauseGame(){
      this.paused = false;
  }

  getCurrentLevel(): LevelInstance{
      return this.currentLevel;
  }

  getPaused(): boolean{
      return this.paused;
  }

  getNotPaused(): boolean{
      return !this.paused;
  }

  getLevelLoadedSubject(): Subject<LevelInstance>{
      return this.levelLoaded;
  }

  getLevelCompleteSubject(): Subject<LevelInstance> {
      return this.levelComplete;
  }

  getGameTickSubject(): Subject<boolean> {
      return this.gameTickSubject;
  }

}


// ###########################################################################################################################################
// ########################################### TEMPORARY TEST LOGIC ##########################################################################
// ###########################################################################################################################################

class TestLevel extends LevelInstance {
  map: LevelMap;
  uiLogic: UiLogic; // TODO it should subscribe to all of the events itself and not be passed them through a 3rd party. Put Mouse service in MC

  constructor(mc:ManagerContext){
    super(mc);
  }

  public initLevel() {
    // level context, which in this case is
      // 2d map tiles
      // bots/units
        // units should have a faction
        // targeting should use a priority
      // buildings

    // create the map, add logic and drawing processes.
    this.map = new LevelMap();
    this.mc.displayManagerService.addDrawer(this.map);
    this.mc.logicManagerService.addLogicProcess(this.map);

    // create all of the buildings and units etc
      // patrolling unit
    let patrol = LogicFactoryService.createPatrol([{x:9,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    let bi = new BotInstance({},2,3,1,1,2*32,3*32);
    bi.setGoal(patrol);
    bi.addPart(new DrawTestBotPart());
  // this.mc.displayManagerService.addDrawer(bi);
    this.mc.logicManagerService.addLogicProcess(bi);

    // patrol = LogicFactoryService.makePatrol([{x:9,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    bi = new BotInstance({},2,33,1,1,2*32,33*32);
    bi.setGoal(patrol);
    bi.addPart(new DrawTestBotPart());
   // this.mc.displayManagerService.addDrawer(bi);
    this.mc.logicManagerService.addLogicProcess(bi);

    let moveTo = LogicFactoryService.createMoveTo([{x:39,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    bi = new BotInstance({},5,33,1,1,5*32,33*32);
    bi.setGoal(moveTo);
    bi.addPart(new DrawTestBotPart());
   // this.mc.displayManagerService.addDrawer(bi);
    this.mc.logicManagerService.addLogicProcess(bi);

    // create the resources tracker

    // create the gui

    // all done
    this.mc.levelManagerService.getLevelLoadedSubject().next(this);
  }

  public getMap(): LevelMap {
    return this.map;
  }
}

// TODO Should have access to mouse and keyboard values
// it may not need to be a logic process.
class UiLogic implements Drawer, LogicProcess {

  //TODO highlight anything we are hovering over? Toggleable

  // states/workflows
    // click on a unit, on next click we will be give it an order, unless shift is also pressed and you are selecting
  // Selection, hold left mouse button, draw a selection box
    // release, go through all tiles and add entities to selected
      // Now state would be selected, so it would be ready to issue commands
        // move
        // patrol
        // guard
        // attack
        // left click again, deselect
        // left click + shift again, add selectection

  update(logicContext: LogicContext) {
    throw new Error('Method not implemented.');
  }

  draw(drawingContext: DrawingContext) {
    throw new Error('Method not implemented.');
  }

}
