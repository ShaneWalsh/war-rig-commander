import { LogicService } from "src/app/services/logic.service";
import { log } from "util";
import { LogicContext } from "../../manager/support/SharedContext";
import { PathfinderService } from "../../map/pathfinder.service";
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

  private path = null;

  constructor(public points:{x,y}[]) {
    // call AI here to workout more waypoints to get around obsticals?
  }

  update(logicContext:LogicContext):boolean {
    if(this.path == null){
      let path = [];
      let point0 = this.points[0];
      let pointA = point0;
      for(let i = 1; i < this.points.length; i++) {
        let pointB = this.points[i];
        path = path.concat(PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap()));
        pointA = pointB;
      }
      // maps from the final point back to the start again
      path = path.concat(PathfinderService.getSinglePath(pointA.x,pointA.y,point0.x,point0.y,logicContext.levelInstance.getMap()));
      if(path != null){
        this.path = path;
      }
    }
    let point = this.path[this.currentPoint];
    const botInstance = logicContext.getBotInstance();
    if(botInstance.tileX == point.x && botInstance.tileY == point.y) {
      this.currentPoint = LogicService.incrementLoop(this.currentPoint, this.path.length);
      point = this.path[this.currentPoint];
      this.turnDirection = null;
    }
    // if the point has changed, change the turn direction.
    const li = logicContext.levelInstance;
    let tile = li.getMap().get(point.x,point.y);
    if(this.turnDirection == null) {
      this.turnDirection =  TurretDirection.calculateTurretDirection(botInstance.getCenterX(),botInstance.getCenterY(),tile.getCenterX(), tile.getCenterY(),4,true);
    } else {
      this.turnDirection.update(botInstance.getCenterX(),botInstance.getCenterY());
    }

    //TODO am I facing the right way?
      // if not then I have to turn
    botInstance.posX += this.turnDirection.speed * this.turnDirection.directionX;
    botInstance.posY += this.turnDirection.speed * this.turnDirection.directionY;


    //TODO what tile am I in now? after moving? Need to update my tile(s)
      // So we are going to follow the topleft tile. If his center point has moved into a new tile then so have the others.
      // pointInRectangle

    //TODO  can I determine which tiles I am moving to and set a State?
      // on a change of direction, new waypoint, this should be set, can then be used in next calculations.
      // TL, T, TR
      // L, NA, R
      // BL, B, BR

    if(LogicService.isPointInRectangle(botInstance.getTopLeftCords(),tile.getCornerCords())){
      botInstance.tileX = tile.x
      botInstance.tileY = tile.y
    }


    // move in the direction of the next waypoint
      // when my centerx+y move out of the current tile, move me into the next tile.

    return false;
  }



}
