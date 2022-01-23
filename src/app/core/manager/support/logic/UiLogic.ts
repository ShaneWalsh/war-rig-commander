// TODO Should have access to mouse and keyboard values

import { BotInstance } from "src/app/core/bot/BotInstance";
import { LogicFactoryService } from "src/app/core/factory/logic-factory.service";
import { MapTile } from "src/app/core/map/LevelMap";
import { TileEntity } from "src/app/core/TileEntity";
import { CustomKeyboardEvent } from "src/app/services/keyboard-event.service";
import { LogicService } from "src/app/services/logic.service";
import { MouseCords, MouseService } from "src/app/services/mouse.service";
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
        return new BotEntitySelectedUiState(this.mc,[ent]);
      return new FreeUiState(this.mc);
    } else { // start dragging
      return new DragSelectingUiState(this.mc,mapTile);
    }
  }
}

/**
 * Nothing selected, ready to wait for a click
 */
class BotEntitySelectedUiState extends FreeUiState {

  private _botInstance:BotInstance[];

  constructor(mc:ManagerContext, _botInstance:BotInstance[]){
    super(mc);
    this._botInstance = _botInstance;
  }

  rightClickRelease(rightRelease: MouseEvent): UiLogicState {
    // make the entity move to the point?
    const mapTile = this.mc.levelMS.getCurrentLevel().getMouseMapTile(rightRelease);
    let moveTo = LogicFactoryService.createMoveTo([mapTile.getCords()]);
    this._botInstance.forEach(b => b.setGoal(moveTo));
    // hold down shift to start waypointing?
    return this;
  }
  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    this._botInstance.forEach(binstance => {
    const eCords = binstance.getUiCords(uiSet);
    LogicService.drawBorder(
      eCords.x, eCords.y,
      uiSet.tileSize,
      uiSet.tileSize,
      dc.cc.topCtx,"#FF0000");
    });
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
    let bots = [];
    const li = this.mc.levelMS.getCurrentLevel();
    const endMapTile = li.getMouseMapTile(leftRelease);
    const dragRect = LogicService.getRectCords(this._mapTile.x, this._mapTile.y,endMapTile.x,endMapTile.y);
    for(let i = dragRect.x; i< dragRect.x2; i++) {
      for(let j = dragRect.y; j< dragRect.y2; j++) {
        const currentTile = li.getMap().get(i,j);
        const optEnt = currentTile.optTileEntity();
        if(optEnt.isPresent()) { // selected a specific entity
          const ent = optEnt.get();
          if(ent instanceof BotInstance)
            bots.push(ent);
        }
      }
    }
    if(bots.length > 0){
      return new BotEntitySelectedUiState(this.mc,bots);
    }
    return new FreeUiState(this.mc);
  }

  draw(dc: DrawingContext) {
    const uiSet = dc.uiSet;
    let mouseCords:MouseCords = MouseService.getMouseCords();
    const tCords = this._mapTile.getUiCords(uiSet);

    let cords = LogicService.getRectCords( tCords.x, tCords.y,
      mouseCords.mouseX,
      mouseCords.mouseY);

    LogicService.drawBorder(
      cords.x,cords.y,
      cords.sx, cords.sy,
      dc.cc.bgCtx,"#FF0000");
  }
}
