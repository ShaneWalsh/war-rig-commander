import { LogicService } from "src/app/services/logic.service";
import { log } from "util";
import { LogicContext } from "../../manager/support/SharedContext";
import { MapTile } from "../../map/LevelMap";
import { PathfinderService } from "../../map/pathfinder.service";
import { TurretDirection } from "../rotation/BulletDirection";


export interface LogicBlock {

  /**
   * Called once, when the logic block is first used.
   * @param logicContext
   */
  load(logicContext:LogicContext);

  /**
   *
   * @param logicContext
   * returns true when the logic is complete. Move to point. false for a endless block, Sentry/Patrol.
   */
  update(logicContext:LogicContext):boolean;

}

export abstract class AbstractLogicBlock implements LogicBlock {
  protected logicId:string; // unique for each logic block.
  protected logicLoadedId:string; // unique for each logic block.
  constructor(namePrefix) {
    // call AI here to workout more waypoints to get around obsticals?
    this.logicId = 'lbi-'+namePrefix+'-'+ Date.now();
    this.logicLoadedId = this.logicId+'-Loaded';

  }

  load(logicContext: LogicContext) {
    if(!logicContext.getLocalVariableOrDefault(this.logicLoadedId,false)){
      this.firstLoad(logicContext);
      logicContext.setLocalVariable(this.logicLoadedId,true);
    } else {
      this.reload(logicContext);
    }
  }

  /**
   * Called the first time this block is loaded for this entity
   * @param logicContext
   */
  abstract firstLoad(logicContext: LogicContext);
  abstract update(logicContext: LogicContext): boolean;
  /**
   * Called whenever a logic block was disused and then returned to for a specific entity.
   * Can clear down shared or local variables that wont survive the context swtich.
   * @param logicContext
   */
  abstract reload(logicContext: LogicContext);
}

export class PatrolLogic extends AbstractLogicBlock {
  firstLoad(logicContext: LogicContext) {
    this.getToFirstPoint(logicContext);
  }
  reload(logicContext: LogicContext) {
    this.getToFirstPoint(logicContext);
  }
  private currentPointVarId = this.logicId+'-currentPoint';
  private turnDirectionVarId = this.logicId+'-turnDirection';

  private pathToPatrolVarId = this.logicId+'-PathToPatrol'; // move to patrol route.
  private pathSharedVarId = this.logicId+'-Path'; // the actual patrol path, in a loop.

  constructor(public points:{x,y}[]) {
    super('Patrol');
  }

  update(logicContext:LogicContext):boolean {

    let proceed = true;
    let pathToPatrol:MoveToLogic = logicContext.getLocalVariable(this.pathToPatrolVarId)
    if(pathToPatrol){
      proceed = pathToPatrol.update(logicContext);
      if(proceed) logicContext.removeLocalVariable(this.pathToPatrolVarId)
    }
    if(proceed) {
      // if the point has changed, change the turn direction.
      let tile = this.getTile(logicContext);
      const botInstance = logicContext.getBotInstance();

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


      // move in the direction of the next waypoint
        // when my centerx+y move out of the current tile, move me into the next tile.
    }
    return false;
  }

  getTile(logicContext: LogicContext): MapTile {
    const li = logicContext.levelInstance;
    // which path are we following?
    let path = this.getPath(logicContext);
    let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
    let nextPoint = path[currentPoint];
    const botInstance = logicContext.getBotInstance();
    if(botInstance.tileX == nextPoint.x && botInstance.tileY == nextPoint.y) {
      currentPoint = LogicService.incrementLoop(currentPoint, path.length);
      nextPoint = path[currentPoint];
      logicContext.setLocalVariable(this.currentPointVarId,currentPoint);
      logicContext.removeLocalVariable(this.turnDirectionVarId);
    }
    let tile = li.getMap().get(nextPoint.x,nextPoint.y);
    return tile;
  }

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
