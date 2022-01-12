import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { PathfinderService } from "src/app/core/map/pathfinder.service";
import { LogicService } from "src/app/services/logic.service";
import { TurretDirection } from "../../rotation/BulletDirection";
import { AbstractLogicBlock } from "../LogicBlock";


export class MoveToLogic extends AbstractLogicBlock {
  firstLoad(logicContext: LogicContext) {
    this.calcPath(logicContext);
  }
  reload(logicContext: LogicContext) {
    this.calcPath(logicContext);
  }

  private currentPointVarId = this.logicId+'-currentPoint';
  private turnDirectionVarId = this.logicId+'-turnDirection';
  private pathLocalVarId = this.logicId+'-Path'; // the actual patrol path, in a loop.

  constructor(public points:{x,y}[]) {
    super('MoveTo');
  }

  update(logicContext:LogicContext):boolean {
    // if the point has changed, change the turn direction.
    let path = logicContext.getLocalVariable(this.pathLocalVarId);
    let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
    let nextPoint = path[currentPoint];
    const botInstance = logicContext.getBotInstance();
    if(botInstance.tileX == nextPoint.x && botInstance.tileY == nextPoint.y) {
      currentPoint = LogicService.incrementLoop(currentPoint, path.length);
      if(currentPoint == 0) { // we are done, we have gone to the end of the path.
        return true;
      }
      nextPoint = path[currentPoint];
      logicContext.setLocalVariable(this.currentPointVarId,currentPoint);
      logicContext.removeLocalVariable(this.turnDirectionVarId);
    }

    const li = logicContext.levelInstance;
    let tile = li.getMap().get(nextPoint.x,nextPoint.y);

    let turnDirection:TurretDirection = logicContext.getLocalVariable(this.turnDirectionVarId);
    if(turnDirection == null) {
      turnDirection =  TurretDirection.calculateTurretDirection(botInstance.getCenterX(),botInstance.getCenterY(),tile.getCenterX(), tile.getCenterY(),4,true);
      logicContext.setLocalVariable(this.turnDirectionVarId, turnDirection);
    } else {
      turnDirection.update(botInstance.getCenterX(),botInstance.getCenterY());
    }

    //TODO am I facing the right way?
      // if not then I have to turn
    botInstance.posX += turnDirection.speed * turnDirection.directionX;
    botInstance.posY += turnDirection.speed * turnDirection.directionY;

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
    return false;
  }

  private calcPath(logicContext: LogicContext) {
    const bi = logicContext.getBotInstance();
    let pathCal = [];
    let point0 = bi.getTileCords();
    let pointA = point0;
    for(let i = 0; i < this.points.length; i++) {
      let pointB = this.points[i];
      pathCal = pathCal.concat(PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap()));
      pointA = pointB;
    }
    if(pathCal != null){
      logicContext.setLocalVariable(this.pathLocalVarId,pathCal);
    } else {
      console.error('Path not possible');
    }
  }

}
