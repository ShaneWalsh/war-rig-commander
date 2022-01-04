import { LogicService } from "src/app/services/logic.service";
import { LogicContext } from "../manager/support/LogicProcess";
import { BotInstance } from "./BotInstance";

export interface BotGoal {

  update(botInstance:BotInstance, logicContext:LogicContext);

}

export class BotGoalPatrol {

  private currentPoint = 0;
  constructor(public points:{x,y}[]) {
    // call AI here to workout more waypoints to get around obsticals?
  }

  // is bot at the current point?
    // no move there
    // yes, then start moving towards the next point.
  update(botInstance:BotInstance, logicContext:LogicContext){
    let point = this.points[this.currentPoint];

    if(botInstance.tileX == point.x && botInstance.tileY == point.y) {
      this.currentPoint = LogicService.incrementLoop(this.currentPoint, this.points.length);
      point = this.points[this.currentPoint];
    }

    // move in the direction of the next waypoint
      // when my centerx+y move out of the current tile, move me into the next tile.

  }

}
