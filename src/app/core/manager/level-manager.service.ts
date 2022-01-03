import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LogicService } from 'src/app/services/logic.service';
import { KeyboardEventService } from '../../services/keyboard-event.service';
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
    // create the map, add logic and drawing processes.
    // create all of the buildings and units etc
    // create the resources tracker
    // create the gui

    this.map = new LevelMap();
    this.mc.displayManagerService.addDrawer(this.map);
    this.mc.logicManagerService.addLogicProcess(this.map);

    // all done
    this.mc.levelManagerService.getLevelLoadedSubject().next(this);
  }

}

class LevelMap implements Drawer, LogicProcess {
  map:any;
  tileSize = 32;
  size = 90;

  constructor(){
    this.map = new Array();

    let randomness = Math.floor((Math.random()*10)+1);
    let randomnessCounter = 0;
    for(let i =0; i < this.size;i++){
      this.map[i] = new Array();
      for(let j =0; j < this.size;j++){
        randomnessCounter++;
        if(randomnessCounter >= randomness){
          this.map[i][j] = "#00FFFF";
          randomnessCounter = 0;
          randomness = Math.floor((Math.random()*10)+1);
        } else {
          this.map[i][j] = "#00FF00";
        }
      }
    }
  }

  update(logicContext: LogicContext) {
    // not sure it needs to do anything?
  }

  draw(dc: DrawingContext) {
    // for(let i =0; i < this.size;i++){
    //   for(let j =0; j < this.size;j++){
    //     LogicService.drawBox(
    //       i*this.tileSize, j * this.tileSize,
    //       this.tileSize,
    //       this.tileSize,
    //       dc.cc.bgCtx,this.map[i][j],"#FFEEDD");
    //   }
    // }
    const uiSet = dc.uis;


    let x = 0;
    let y = 0;
    for(let viewX = uiSet.viewTilesStartPosX; viewX < this.size && viewX < uiSet.viewTilesEndPosX; viewX++,x++){
      for(let viewY = uiSet.viewTilesStartPosY; viewY < this.size && viewY < uiSet.viewTilesEndPosY; viewY++,y++){
        if(viewX >= 0 && viewY >= 0){
          LogicService.drawBox(
            (x*uiSet.tileSize)-uiSet.viewXOffset,
            (y*uiSet.tileSize)-uiSet.viewYOffset,
            uiSet.tileSize,
            uiSet.tileSize,
            dc.cc.bgCtx,this.map[viewX][viewY],"#FFEEDD");
        }
      }
      y = 0;
    }

  }


}

