import { CanvasContainer } from "./CanvasContainer";
import { UiSettings } from "./UiSettings";

// can easily add more values are required for drawing.
export class DrawingContext {
  constructor(public cc:CanvasContainer, public uis:UiSettings){}
}

// Default class for drawing something to the screen.
export interface Drawer {

  draw(drawingContext:DrawingContext);

}
