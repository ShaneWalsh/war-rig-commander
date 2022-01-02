import { ElementRef, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseService } from 'src/app/services/mouse.service';
import { ResizeService } from 'src/app/services/resize.service';
import { UiSettings } from 'src/app/services/support/UiSettings';
import { CanvasContainer } from '../CanvasContainer';
import { Drawer, DrawingContext } from '../Drawer';

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
  public canvasContainer: CanvasContainer;
  public uiSettings: UiSettings;

  // the actual drawers, menus, game map, bots, etc.
  private drawers: Drawer[] = [];

  constructor() {
    this.uiSettings = new UiSettings();
    // this is an important one, if the screen size changes, we need to re calcualte the offsets so the mouse is still correct.
    // what else do I have to do here when the screen resizes??
    ResizeService.onResize$.subscribe(event => {
      MouseService.resizeUpdateOffsets(this.canvasTop.nativeElement);
      this.uiResize();
    })
  }

  public update() {
    this.canvasContainer.clearCanvas();
    // what else do we draw? Rather than reaching out, should things add themselves to be drawn?
    const drawingContext = new DrawingContext(this.canvasContainer);
    this.drawers.forEach( drawer => {
      drawer.draw(drawingContext);
    });
  }

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
    this.uiSettings.viewportSizeX = this.width;
    this.uiSettings.viewportSizeY = this.height;
    this.uiSettings.reCalcualteValues();
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
    this.canvasContainer = new CanvasContainer(
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


