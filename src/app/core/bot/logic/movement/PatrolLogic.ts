import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { PathfinderService } from "src/app/core/map/pathfinder.service";
import { LogicService } from "src/app/services/logic.service";
import { MoveToLogic } from "./MoveToLogic";

export class PatrolLogic extends MoveToLogic {
  firstLoad(logicContext: LogicContext) {
    this.getToFirstPoint(logicContext);
  }
  reload(logicContext: LogicContext) {
    this.getToFirstPoint(logicContext);
  }

  private pathToPatrolVarId = this.logicId+'-PathToPatrol'; // move to patrol route.
  private pathSharedVarId = this.logicId+'-PathSharedPatrol'; // move to patrol route.

  constructor(public points:{x,y}[]) {
    super(points,true,'Patrol');
  }

  update(logicContext:LogicContext):boolean {

    let proceed = true;
    let pathToPatrol:MoveToLogic = logicContext.getLocalVariable(this.pathToPatrolVarId)
    if(pathToPatrol){
      proceed = pathToPatrol.update(logicContext);
      if(proceed) logicContext.removeLocalVariable(this.pathToPatrolVarId)
    } else {
      return super.updatePath(logicContext,logicContext.getSharedVariable(this.pathSharedVarId));
    }
    return false;
  }

  /**
   * Calculate the patrol route.
   */
  getPath(logicContext: LogicContext) {
    let path = logicContext.getSharedVariable(this.pathSharedVarId);
    if(path == null) { // TODO should this be a shared variable so others can reuse the same path?
      let pathCal = [];
      let point0 = this.points[0];
      let pointA = point0;
      for(let i = 1; i < this.points.length; i++) {
        let pointB = this.points[i];
        pathCal = pathCal.concat(PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap()));
        pointA = pointB;
      }
      // maps from the final point back to the start again
      pathCal = pathCal.concat(PathfinderService.getSinglePath(pointA.x,pointA.y,point0.x,point0.y,logicContext.levelInstance.getMap()));
      if(pathCal != null){
        path = pathCal;
        logicContext.setSharedVariable(this.pathSharedVarId,path);
      }
    }
    return path;
  }

  /**
   * Get the bot from where they are now, back to the last point they were on on the patrol route.
   */
  getToFirstPoint(logicContext: LogicContext) {
    let path = this.getPath(logicContext);
    let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
    let nextPoint = path[currentPoint];
    const bi = logicContext.getBotInstance();
    // if we are too far away we need to move up to point 0 before continuing
    if( LogicService.posDiff(bi.tileX,nextPoint.x) > 1 || LogicService.posDiff(bi.tileY,nextPoint.y) > 1 ) {
      let mtl = new MoveToLogic([nextPoint]);
      mtl.load(logicContext);
      logicContext.setLocalVariable(this.pathToPatrolVarId,mtl);
    }
  }

}
