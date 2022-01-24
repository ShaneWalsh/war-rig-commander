import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { MapTile } from "src/app/core/map/LevelMap";
import { PathfinderService } from "src/app/core/map/pathfinder.service";
import { Opt } from "src/app/core/Opt";
import { LogicService } from "src/app/services/logic.service";
import { BotInstance } from "../../BotInstance";
import { TurretDirection } from "../../rotation/BulletDirection";
import { AbstractLogicBlock } from "../LogicBlock";


export class MoveToLogic extends AbstractLogicBlock {
  firstLoad(logicContext: LogicContext) {
    this.calcPath(logicContext);
  }
  reload(logicContext: LogicContext) {
    this.calcPath(logicContext);
  }

  protected currentPointVarId = this.logicId+'-currentPoint';
  protected moveDirectionVarId = this.logicId+'-moveDirection';
  protected headDirectionVarId = this.logicId+'-headDirection';
  protected pathVarId = this.logicId+'-Path'; // the actual path

  constructor(public points:{x,y}[], public loopPath=false, public LogicCode='MoveTo') {
    super(LogicCode);
  }

  update(logicContext:LogicContext):boolean {
    // if the point has changed, change the turn direction.
    let pathOpt = logicContext.getLocalVariableOrDefault(this.pathVarId, Opt.empty());
    return this.updatePath(logicContext,pathOpt);
  }

  updatePath(logicContext:LogicContext, pathOpt:Opt): boolean {
    if(pathOpt.isPresent()) {
      let path = pathOpt.get();
      let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
      let nextPoint = path[currentPoint];
      const botInstance = logicContext.getBotInstance();
      const li = logicContext.levelInstance;

      if(botInstance.tileX == nextPoint.x && botInstance.tileY == nextPoint.y) {
        currentPoint = LogicService.incrementLoop(currentPoint, path.length);
        if(currentPoint == 0 && !this.loopPath) { // we are done, we have gone to the end of the path.
          return this.atCenter(logicContext, botInstance, li.getMap().get(nextPoint.x,nextPoint.y)); // lets try and center in the tile
        }
        nextPoint = path[currentPoint];
        if(nextPoint == null) {
          console.error("Why is this null!"); // TODO handle this correctly, how to push this up the line?
          return true;
        }
        logicContext.setLocalVariable(this.currentPointVarId,currentPoint);
        logicContext.setLocalVariable(this.headDirectionVarId, PathfinderService.getHeadingDirection(botInstance.getTileCords(),nextPoint));
        logicContext.removeLocalVariable(this.moveDirectionVarId);
      }

      let nextTile = li.getMap().get(nextPoint.x,nextPoint.y);

      // TODO can I move into the target tile?
        // Something may have changed since the path was chosen, perhaps, its now blocked.
          // IF blocked, pathfind again? but not if its going to move out of my way?
            // is it moving?
              // is it heading away from me,
                // then just wait for it to move away.
              // towards me
                // then I should move around it, if I can. or turn around,
                // or just stop, 'say path is blocked here sir'.

      let moveDirection:TurretDirection = logicContext.getLocalVariable(this.moveDirectionVarId);
      if(moveDirection == null) {
        moveDirection =  TurretDirection.calculateTurretDirection(botInstance.getCenterX(),botInstance.getCenterY(),nextTile.getCenterX(), nextTile.getCenterY(),2,true);
        logicContext.setLocalVariable(this.moveDirectionVarId, moveDirection);
      } else {
        moveDirection.update(botInstance.getCenterX(),botInstance.getCenterY());
      }

      // TODO facing, the right way, then rotate before moving?

      // Free to move, so move.
      botInstance.posX += moveDirection.speed * moveDirection.directionX;
      botInstance.posY += moveDirection.speed * moveDirection.directionY;

      // TODO what tile am I in now? after moving? Need to update my tile(s)
      if(LogicService.isPointInRectangle(botInstance.getTopLeftTileCenterCords(),nextTile.getCornerCords())){
        let currentTile = li.getMap().get(botInstance.tileX,botInstance.tileY);
        // TODO handle the existing entity in the tile of there is one, what happens to it? Right now its just vanishing.
        currentTile.removeTileEntity();
        nextTile.setTileEntity(botInstance);
        botInstance.tileX = nextTile.x
        botInstance.tileY = nextTile.y
        // TODO update all tiles of the move, Some bots can be bigger than one tile?
        // TODO check if its occupied by anything that I can crush, if so, crush it, IF!!! our hitboxes intersect.

        // TODO  can I determine which tiles I am moving to and set a State?
          // on a change of direction, new waypoint, this should be set, can then be used in next calculations.
          // TL, T, TR
          // L, NA, R
          // BL, B, BR
      }
      return false;
    } else { // we have no path for whatever reason, so return.
      return true;
    }
  }

  /**
   * Will continue the on the path and center on the targetted tile
   */
  private atCenter(logicContext:LogicContext, bi:BotInstance, nextPoint: MapTile ): boolean {
    let moveDirection:TurretDirection = logicContext.getLocalVariable(this.moveDirectionVarId);
    if(LogicService.isDiffLessThanCalc(bi.getCenterX(),nextPoint.getCenterX(),moveDirection.speed) && LogicService.isDiffLessThanCalc(bi.getCenterY(),nextPoint.getCenterY(),moveDirection.speed)){
      return true; // Complete, finish movement Logic.
    } else { // nudge close to the center of the tile.
      moveDirection.update(bi.getCenterX(),bi.getCenterY());
      bi.posX += moveDirection.speed * moveDirection.directionX;
      bi.posY += moveDirection.speed * moveDirection.directionY;
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
      const path = PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap());
      // TODO decision here, should we drop the path entirely or see if we can still reach the other points?
      if(path != null) { // Dropping for now, perhaps we skip this point because its unreacable?
        pathCal = pathCal.concat(path);
        pointA = pointB;
      } else {
        console.error('Path not possible, dropping');
        return;
      }
    }
    if(pathCal != null && pathCal.length > 0 && pathCal[0] != null){
      logicContext.setLocalVariable(this.pathVarId,new Opt(pathCal));
      logicContext.setLocalVariable(this.headDirectionVarId, PathfinderService.getHeadingDirection(bi.getTileCords(),pathCal[0]));
    } else {
      // todo
      console.error('Path not possible');
    }
  }
}



