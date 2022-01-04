import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LogicService } from 'src/app/services/logic.service';
import { KeyboardEventService } from '../../services/keyboard-event.service';
import { LevelMap } from '../map/LevelMap';
import { Drawer, DrawingContext } from './support/Drawer';
import { LevelInstance } from './support/LevelInstance';
import { LogicContext, LogicProcess } from './support/LogicProcess';
import { ManagerContext } from './support/ManagerContext';

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

    // create the resources tracker

    // create the gui

    // all done
    this.mc.levelManagerService.getLevelLoadedSubject().next(this);
  }

}

