import { BotTeam, TeamHandler, TeamRelationship } from "src/app/core/bot/BotTeam";
import { CustomKeyboardEvent } from "src/app/services/keyboard-event.service";
import { LevelMap, MapTile } from "../../../map/LevelMap";
import { UiLogic } from "../logic/UiLogic";
import { ManagerContext } from "../ManagerContext";
import { LogicContext } from "../SharedContext";

export abstract class LevelInstance {
  constructor(public mc:ManagerContext) {

  }

  public abstract initLevel(logicContext:LogicContext);
  public abstract getMap():LevelMap;
  public abstract getTeamHandler():TeamHandler;
  public abstract getUiLogic():UiLogic;

  getMouseMapTile(leftClick: MouseEvent):MapTile {
    const uiSet = this.mc.displayMS.getUiSettings();
    let x = Math.floor((leftClick.clientX+uiSet.curX)/uiSet.tileSize);
    let y = Math.floor((leftClick.clientY+uiSet.curY)/uiSet.tileSize);
    return this.getMap().get(x,y);
  }

  public leftClick(leftClick: MouseEvent){
    this.getUiLogic().leftClick(leftClick);
  }
  public leftClickRelease(leftRelease: MouseEvent) {
    this.getUiLogic().leftClickRelease(leftRelease);
  }
  public rightClickRelease(rightRelease: MouseEvent) {
    this.getUiLogic().rightClickRelease(rightRelease);
  }
  public processKeyUp(customKeyboardEvent: CustomKeyboardEvent){
    this.getUiLogic().keyUp(customKeyboardEvent);
  }
  public processKeyDown(customKeyboardEvent: CustomKeyboardEvent){
    this.getUiLogic().keyDown(customKeyboardEvent);
  }

  public isEnemy(bt1:BotTeam, bt2:BotTeam):boolean {
    return this.getTeamHandler().getRelationship(bt1,bt2) === TeamRelationship.ENEMIES;
  }
}


