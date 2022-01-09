import { LogicService } from "src/app/services/logic.service";
import { LogicContext } from "../../manager/support/SharedContext";
import { TurretDirection } from "../rotation/BulletDirection";


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
  private turnDirection: TurretDirection = null;

  constructor(public points:{x,y}[]) {
    // call AI here to workout more waypoints to get around obsticals?
  }

  update(logicContext:LogicContext):boolean {
    let point = this.points[this.currentPoint];
    const botInstance = logicContext.getBotInstance();
    if(botInstance.tileX == point.x && botInstance.tileY == point.y) {
      this.currentPoint = LogicService.incrementLoop(this.currentPoint, this.points.length);
      point = this.points[this.currentPoint];
      this.turnDirection = null;
    }
    // if the point has changed, change the turn direction.
    if(this.turnDirection == null){
      const li = logicContext.levelInstance;
      let tile = li.getMap().get(point.x,point.y);
      this.turnDirection =  TurretDirection.calculateTurretDirection(botInstance.getCenterX(),botInstance.getCenterY(),tile.getCenterX(), tile.getCenterY(),4,true);
    }

    //TODO am I facing the right way?
      // if not then I have to turn
    botInstance.posX += this.turnDirection.speed * this.turnDirection.directionX;
    botInstance.posY += this.turnDirection.speed * this.turnDirection.directionY;

    //TODO what time am I in now? after moving? Need to update my tile(s)


    // move in the direction of the next waypoint
      // when my centerx+y move out of the current tile, move me into the next tile.

    return false;
  }



}
