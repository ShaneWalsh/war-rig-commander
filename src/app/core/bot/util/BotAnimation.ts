import { DrawingContext, LogicContext } from "../../manager/support/SharedContext";
import { ImageCycle } from "../../Util/ImageCycle";

enum BotAnimationState {
  STATIONARY='STATIONARY',
  WALKING='WALKING',
  RUNNING='RUNNING',
  DAMAGED='DAMAGED',
}

/**
 * Handles animations while bot is alive, not when dead.
 * Making an assumption all of the images are the same size
 */
export class BotAnimation {

  private animationState:BotAnimationState = BotAnimationState.STATIONARY;

  private currentCycle: ImageCycle;

  constructor(
    public stationaryAnimation:ImageCycle,
    public walkingAnimation:ImageCycle,
    public runningAnimation:ImageCycle,
    public damagedAnimation:ImageCycle
  ) {
    this.currentCycle = stationaryAnimation
  }

  setAnimationState(animationState:BotAnimationState){
    this.animationState = animationState;
    this.currentCycle.reset(); // so we can easily reuse it again.
    switch(animationState){
      case BotAnimationState.STATIONARY: this.currentCycle = this.stationaryAnimation; break;
      case BotAnimationState.WALKING: this.currentCycle = this.walkingAnimation; break;
      case BotAnimationState.RUNNING: this.currentCycle = this.runningAnimation; break;
      case BotAnimationState.DAMAGED: this.currentCycle = this.damagedAnimation; break;
    }
  }

  update ( drawingContext:DrawingContext, cords:any, rotation:number = null, damaged:boolean = false) {
    const img = this.currentCycle.update();
    // todo THE ACTUAL drawing logic
  }

}
