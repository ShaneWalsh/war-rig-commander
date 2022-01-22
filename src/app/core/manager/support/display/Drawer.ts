import { DrawingContext } from "../SharedContext";


// Default class for drawing something to the screen.
export interface Drawer {

  draw(drawingContext:DrawingContext);

}
