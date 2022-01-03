import { ElementRef, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseService } from 'src/app/services/mouse.service';
import { ResizeService } from 'src/app/services/resize.service';
import { UiSettings } from 'src/app/core/manager/support/UiSettings';
import { CanvasContainer } from './support/CanvasContainer';
import { Drawer, DrawingContext } from './support/Drawer';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';

/**
 * Handles the drawers, and the UI resiszing etc. Doesnt deal with any specific drawing logic. It should be able to support, gameplay and menus etc.
 */
@Injectable({
  providedIn: 'root'
})
export class DisplayManagerService {
  private canvasBG: ElementRef;
  private canvasGround: ElementRef;
  private canvasBGShadow: ElementRef;
  private canvasMain: ElementRef;
  private canvasTop: ElementRef;

  // Drawing values for the canvases
  public width=window.innerWidth;// for full screen
  public height=window.innerHeight;// for full screen
  private _canvasContainer: CanvasContainer;
  private _uiSettings: UiSettings;

  // the actual drawers, menus, game map, bots, etc.
  private drawers: Drawer[] = [];

  constructor(private keyboardEventService:KeyboardEventService) {
    this._uiSettings = new UiSettings();

    ResizeService.onResize$.subscribe(event => {
      MouseService.resizeUpdateOffsets(this.canvasTop.nativeElement);
      this.uiResize();
    })

    keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
          this._uiSettings.processKeyDown(customKeyboardEvent);
    });

    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
        this._uiSettings.processKeyUp(customKeyboardEvent);
    });
  }

  public update() {
    this._canvasContainer.clearCanvas();
    this._uiSettings.update();
    const drawingContext = new DrawingContext(this._canvasContainer, this._uiSettings);
    this.drawers.forEach( drawer => {
      drawer.draw(drawingContext);
    });
  }

  // #################
  // #### GET SET ####
  // #################

  public setDrawers(drawers:Drawer[]){
    this.drawers = drawers;
  }

  public addDrawer(drawer:Drawer) {
    this.drawers.push(drawer);
  }

  public removeDrawer(drawer:Drawer) {
    this.drawers.splice(this.drawers.indexOf(drawer));
  }

  // #################
  // #### Utility ####
  // #################

  public uiResize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.rebuildCanvasContainer();
    this._uiSettings.viewportSizeX = this.width;
    this._uiSettings.viewportSizeY = this.height;
    this._uiSettings.reCalcualteValues();
  }

  public setCanvasElements(canvasBG: ElementRef, canvasGround: ElementRef, canvasBGShadow: ElementRef, canvasMain: ElementRef, canvasTop: ElementRef) {
    this.canvasBG = canvasBG;
    this.canvasGround = canvasGround;
    this.canvasBGShadow = canvasBGShadow;
    this.canvasMain = canvasMain;
    this.canvasTop = canvasTop;
    this.uiResize();
  }

  private rebuildCanvasContainer() {
    this._canvasContainer = new CanvasContainer(
      this.getCanvasEl(this.canvasBG, this.width, this.height),
      this.getCanvasEl(this.canvasGround, this.width, this.height),
      this.getCanvasEl(this.canvasBGShadow, this.width, this.height),
      this.getCanvasEl(this.canvasMain, this.width, this.height),
      this.getCanvasEl(this.canvasTop, this.width, this.height)
    );
  }

  private getCanvasEl(ref:ElementRef, width, height):any{
    var el = ref.nativeElement;
    el.width = width;
    el.height = height;
    return el;
  }

}


