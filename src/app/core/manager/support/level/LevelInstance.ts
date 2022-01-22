import { CustomKeyboardEvent } from "src/app/services/keyboard-event.service";
import { LevelMap, MapTile } from "../../../map/LevelMap";
import { UiLogic } from "../logic/UiLogic";
import { ManagerContext } from "../ManagerContext";

export abstract class LevelInstance {
  constructor(public mc:ManagerContext) {
    this.initLevel();
  }

  public abstract initLevel();
  public abstract getMap():LevelMap;
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
}


