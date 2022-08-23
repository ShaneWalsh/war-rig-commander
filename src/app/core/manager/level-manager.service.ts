import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SpawnBuilding } from 'src/app/impl/extractor/bot/SpawnBuilding';
import { MouseService } from 'src/app/services/mouse.service';
import { KeyboardEventService } from '../../services/keyboard-event.service';
import { BotInstance } from '../bot/BotInstance';
import { DrawTestBotPart } from '../bot/BotPart';
import { BotTeam, TeamHandler, TeamRelationship } from '../bot/BotTeam';
import { TargetFinder } from '../bot/brain/TargetFinder';
import { TurretBrain } from '../bot/brain/TurretBrain';
import { Cords } from '../Cords';
import { LogicFactory } from '../factory/logic-factory';
import { LevelMap } from '../map/LevelMap';
import { LevelInstance } from './support/level/LevelInstance';
import { UiLogic } from './support/logic/UiLogic';
import { ManagerContext } from './support/ManagerContext';
import { LogicContext } from './support/SharedContext';

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

  private map: LevelMap;
  private uiLogic: UiLogic; // TODO it should subscribe to all of the events itself and not be passed them through a 3rd party. Put Mouse service in MC
  private teamHandler: TeamHandler;

  constructor(mc:ManagerContext) {
    super(mc);
  }

  public initLevel(logicContext:LogicContext) {

    let targetFinder = new TargetFinder(5);
    let turretBrain = new TurretBrain(50,'todo amno','todo config');

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

    // Teams
    let btGood = new BotTeam("Goodguys", true);
    let btAllies = new BotTeam("Allyguys", false);
    let btBad = new BotTeam("Badguys", false);
    this.teamHandler = new TeamHandler();
    this.teamHandler.addOrUpdateRelationship(btGood,btBad,TeamRelationship.ENEMIES);
    this.teamHandler.addOrUpdateRelationship(btAllies,btBad,TeamRelationship.ENEMIES);
    this.teamHandler.addOrUpdateRelationship(btAllies,btGood,TeamRelationship.ALLIED);

    // create all of the buildings and units etc
    // patrolling unit
    let patrol = LogicFactory.createPatrol([new Cords(9,4), new Cords(13,3), new Cords(16,17),new Cords(5,17)]);
    let bi = new BotInstance({},btGood,2,3,1,1,2*32,3*32);
    bi.setGoal(patrol);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    // patrol = LogicFactoryService.makePatrol([{x:9,y:4}, {x:13,y:3}, {x:16,y:17},{x:5,y:17}]);
    bi = new BotInstance({},btGood,2,23,1,1,2*32,23*32);
    bi.setGoal(patrol);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    bi = new BotInstance({},btGood, 2,24,1,1,2*32,23*32);
    bi.setGoal(patrol);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    bi = new BotInstance({},btGood, 3,25,1,1,2*32,23*32);
    bi.setGoal(patrol);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    bi = new BotInstance({},btGood, 4,27,1,1,2*32,23*32);
    bi.setGoal(patrol);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    let moveTo = LogicFactory.createMoveTo([new Cords(39,4), new Cords(13,3), new Cords(16,17),new Cords(5,17)]);
    bi = new BotInstance({},btBad, 5,33,1,1,5*32,33*32);
    bi.setGoal(moveTo);
    bi.addBrain(targetFinder);
    bi.addBrain(turretBrain);
    bi.addPart(new DrawTestBotPart());
    bi.init(logicContext);

    // Building
    let building = new SpawnBuilding({},btBad,20,20,2,2,20*32,20*32,(lc:LogicContext,cords:Cords) => {
      let moveTo = LogicFactory.createMoveTo([new Cords(39,4), new Cords(13,3), new Cords(16,17),new Cords(5,17)]);
      bi = new BotInstance({},btBad, cords.x,cords.y,1,1,cords.x*32,cords.y*32);
      bi.setGoal(moveTo);
      bi.addBrain(targetFinder);
      //bi.addBrain(turretBrain);
      bi.addPart(new DrawTestBotPart());
      return bi;
    },30,null);
    building.init(logicContext);
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
  public getTeamHandler(): TeamHandler {
    return this.teamHandler;
  }
}
