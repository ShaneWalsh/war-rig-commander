import { LogicService } from "src/app/services/logic.service";
import { LogicContext } from "../../manager/support/LogicProcess";
import { BotInstance } from "../BotInstance";


export interface LogicBlock {

  /**
   *
   * @param botInstance
   * @param logicContext
   * returns true when the logic is complete. Move to point. false for a endless block, Sentry/Patrol.
   */
  update(logicContext:LogicContext):boolean;

}

export class PatrolLogic implements LogicBlock {
  private currentPoint = 0;
  constructor(public points:{x,y}[]) {
    // call AI here to workout more waypoints to get around obsticals?
  }

  update(logicContext:LogicContext):boolean {
    let point = this.points[this.currentPoint];
    const botInstance = logicContext.getBotInstance();
    if(botInstance.tileX == point.x && botInstance.tileY == point.y) {
      this.currentPoint = LogicService.incrementLoop(this.currentPoint, this.points.length);
      point = this.points[this.currentPoint];
    }

    // move in the direction of the next waypoint
      // when my centerx+y move out of the current tile, move me into the next tile.
    return false;
  }

}
