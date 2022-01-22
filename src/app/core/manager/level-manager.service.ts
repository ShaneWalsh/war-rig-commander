import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MouseService } from 'src/app/services/mouse.service';
import { CustomKeyboardEvent, KeyboardEventService } from '../../services/keyboard-event.service';
import { BotGoalSimple } from '../bot/BotGoal';
import { BotInstance } from '../bot/BotInstance';
import { DrawTestBotPart } from '../bot/BotPart';
import { LogicFactoryService } from '../factory/logic-factory.service';
import { LevelMap } from '../map/LevelMap';
import { Drawer } from './support/display/Drawer';
import { LevelInstance } from './support/level/LevelInstance';
import { LogicProcess } from './support/logic/LogicProcess';
import { UiLogic } from './support/logic/UiLogic';
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
      if (this.getNotPaused()) {
          this.currentLevel.processKeyDown(customKeyboardEvent);
      }
    });
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
      if (this.getNotPaused()) {
        this.currentLevel.processKeyUp(customKeyboardEvent);
      }
    });
    MouseService.leftClickSubject$.subscribe(leftClick => {
      if (this.getNotPaused()) {
        console.log(leftClick);
        this.currentLevel.leftClick(leftClick);
      }
    });
    MouseService.leftClickReleaseSubject$.subscribe(leftRelease => {
      if (this.getNotPaused()) {
        this.currentLevel.leftClickRelease(leftRelease);
      }
    });
    MouseService.rightClickReleaseSubject$.subscribe(rightRelease => {
      if (this.getNotPaused()) {
        this.currentLevel.rightClickRelease(rightRelease);
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
    this.mc.displayMS.addDrawer(this.map);
    this.mc.logicMS.addLogicProcess(this.map);

    // create all of the buildings and units etc
    // patrolling unit
    let patrol = LogicFactoryService.createPatrol([{x:9,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    let bi = new BotInstance({},2,3,1,1,2*32,3*32);
    bi.setGoal(patrol);
    bi.addPart(new DrawTestBotPart());
    this.mc.logicMS.addLogicProcess(bi);

    // patrol = LogicFactoryService.makePatrol([{x:9,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    bi = new BotInstance({},2,33,1,1,2*32,33*32);
    bi.setGoal(patrol);
    bi.addPart(new DrawTestBotPart());
    this.mc.logicMS.addLogicProcess(bi);

    let moveTo = LogicFactoryService.createMoveTo([{x:39,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    bi = new BotInstance({},5,33,1,1,5*32,33*32);
    bi.setGoal(moveTo);
    bi.addPart(new DrawTestBotPart());
    this.mc.logicMS.addLogicProcess(bi);

    // create the resources tracker

    // create the gui
    this.uiLogic = new UiLogic(this.mc);
    this.mc.displayMS.addDrawer(this.uiLogic);
    // all done
    this.mc.levelMS.getLevelLoadedSubject().next(this);
  }

  public getMap(): LevelMap {
    return this.map;
  }
  public getUiLogic(): UiLogic {
    return this.uiLogic;
  }
}
