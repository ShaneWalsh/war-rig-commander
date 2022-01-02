import { CanvasContainer } from "./CanvasContainer";

// can easily add more values are required for drawing.
export class DrawingContext {
  constructor(public canvasContainer:CanvasContainer){}
}
// Default class for drawing something to the screen.
export class Drawer {

  draw(drawingContext:DrawingContext){

  }

}
