// TODO Should have access to mouse and keyboard values

import { BotInstance } from "src/app/core/bot/BotInstance";
import { LogicFactoryService } from "src/app/core/factory/logic-factory.service";
import { MapTile } from "src/app/core/map/LevelMap";
import { TileEntity } from "src/app/core/TileEntity";
import { CustomKeyboardEvent } from "src/app/services/keyboard-event.service";
import { LogicService } from "src/app/services/logic.service";
import { Drawer } from "../display/Drawer";
import { ManagerContext } from "../ManagerContext";
import { DrawingContext, LogicContext } from "../SharedContext";
import { LogicProcess } from "./LogicProcess";

// it may not need to be a logic process.
export class UiLogic implements Drawer, LogicProcess {
  // Now state would be selected, so it would be ready to issue commands
  // move
  // patrol
  // guard
  // attack
  // left click again, deselect
  // left click + shift again, add selectection

  //TODO highlight anything we are hovering over? Toggleable
  private _uiLogicState:UiLogicState;
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

  constructor(public mc:ManagerContext){
    this._uiLogicState = new FreeUiState(this.mc);
  }

  init(logicContext: LogicContext) {}
  destroy(logicContext: LogicContext) {}

  update(logicContext: LogicContext) {
    throw new Error('Method not implemented.');
  }

  draw(dc: DrawingContext) {
    this._uiLogicState.draw(dc);
  }

  ////////////// BINDINGS #######################
  keyDown(customKeyboardEvent: CustomKeyboardEvent) {
    this._uiLogicState = this._uiLogicState.keyDown(customKeyboardEvent);
  }
  keyUp(customKeyboardEvent: CustomKeyboardEvent) {
    this._uiLogicState = this._uiLogicState.keyUp(customKeyboardEvent);
  }
  leftClick(leftClick: MouseEvent) {
    this._uiLogicState = this._uiLogicState.leftClick(leftClick);
  }
  leftClickRelease(leftRelease: MouseEvent) {
    this._uiLogicState = this._uiLogicState.leftClickRelease(leftRelease);
  }
  rightClickRelease(rightRelease: MouseEvent) {
    this._uiLogicState = this._uiLogicState.rightClickRelease(rightRelease);
  }

}

class UiLogicState implements Drawer {
  constructor(public mc:ManagerContext){

  }
  draw(drawingContext: DrawingContext) {}
  keyUp(customKeyboardEvent: CustomKeyboardEvent):UiLogicState { return this; }
  keyDown(customKeyboardEvent: CustomKeyboardEvent):UiLogicState { return this; }
  leftClick(leftClick: MouseEvent):UiLogicState { return this; }
  leftClickRelease(leftRelease: MouseEvent): UiLogicState { return this; }
  rightClickRelease(rightRelease: MouseEvent): UiLogicState { return this; }
}

/**
 * Nothing selected, ready to wait for a click
 */
class FreeUiState extends UiLogicState {
  constructor(mc:ManagerContext){
    super(mc);
  }
  /**
   * Selecting a tile entity or start dragging a selection box
   */
  leftClick(leftClick: MouseEvent):UiLogicState {
    // if I have just clicked on a tile entity, select it
    const li = this.mc.levelMS.getCurrentLevel();
    const mapTile = li.getMouseMapTile(leftClick);
    const optEnt = mapTile.optTileEntity();
    if(optEnt.isPresent()) { // selected a specific entity
      const ent = optEnt.get();
      if(ent instanceof BotInstance)
        return new BotEntitySelectedUiState(this.mc,ent);
      return new FreeUiState(this.mc);
    } else { // start dragging
      return new DragSelectingUiState(this.mc,mapTile)
    }
  }
}

/**
 * Nothing selected, ready to wait for a click
 */
class BotEntitySelectedUiState extends UiLogicState {

  private _botInstance:BotInstance;

  constructor(mc:ManagerContext, _botInstance:BotInstance){
    super(mc);
    this._botInstance = _botInstance;
  }

  rightClickRelease(rightRelease: MouseEvent): UiLogicState {
    // make the entity move to the point?
    const mapTile = this.mc.levelMS.getCurrentLevel().getMouseMapTile(rightRelease);
    let moveTo = LogicFactoryService.createMoveTo([mapTile.getCords()]);
    this._botInstance.setGoal(moveTo);
    // hold down shift to start waypointing?
    return new FreeUiState(this.mc);
  }
  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    const eCords = this._botInstance.getTileCords();
    LogicService.drawBorder(
      ((eCords.x*uiSet.tileSize)-uiSet.curX),
      ((eCords.y*uiSet.tileSize)-uiSet.curY),
      uiSet.tileSize,
      uiSet.tileSize,
      dc.cc.topCtx,"#FF0000");

  }
}

/**
 * Nothing selected, ready to wait for a click
 */
 class DragSelectingUiState extends UiLogicState {

  private _mapTile:MapTile;

  constructor(mc:ManagerContext, mapTile:MapTile){
    super(mc);
    this._mapTile = mapTile;
  }
  leftClickRelease(leftRelease: MouseEvent): UiLogicState {
    // todo select all of the entities in all of the tiles between the clicks
    return new FreeUiState(this.mc);
  }

  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    const tCords = this._mapTile;
    LogicService.drawBorder(
      ((tCords.x*uiSet.tileSize)-uiSet.curX),
      ((tCords.y*uiSet.tileSize)-uiSet.curY),
      uiSet.tileSize,
      uiSet.tileSize,
      dc.cc.bgCtx,"#FF0000");

  }
}
