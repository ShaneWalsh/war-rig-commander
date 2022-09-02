import { Cords } from "src/app/core/Cords";
import { LevelInstance } from "src/app/core/manager/support/level/LevelInstance";
import { LogicContext } from "src/app/core/manager/support/SharedContext";
import { MapTile, TraverseStatus } from "src/app/core/map/LevelMap";
import { MoveNode, PathfinderService } from "src/app/core/map/pathfinder.service";
import { Opt } from "src/app/core/Opt";
import { ConfigService } from "src/app/services/config.service";
import { LogicService } from "src/app/services/logic.service";
import { BotInstance } from "../../BotInstance";
import { TurretDirection } from "../../rotation/BulletDirection";
import { AbstractLogicBlock, LogicBlockStatus } from "../LogicBlock";
import { WaitLogic } from "../utility/WaitLogic";


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
  protected pathVarId = this.logicId+'-Path'; // the actual path, unique for each bot, because they can start from different palces.

  constructor(public points:Cords[], public loopPath=false, public LogicCode='MoveTo') {
    super(LogicCode);
  }

  updateLogic(logicContext:LogicContext) {
    // if the point has changed, change the turn direction.
    let pathOpt = logicContext.getLocalVariableOrDefault(this.pathVarId, Opt.empty());
    this.updatePath(logicContext,pathOpt);
  }

  updatePath(logicContext:LogicContext, pathOpt:Opt) {
    if(pathOpt.isPresent()) {
      let path = pathOpt.get();
      let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
      let nextPoint = path[currentPoint];
      const botInstance = logicContext.getBotInstance();
      const li = logicContext.levelInstance;

      // am I at the current tile?
        // loop is done, if not looping, move to center
        // else get next point
      if(botInstance.tileX == nextPoint.x && botInstance.tileY == nextPoint.y) {
        currentPoint = LogicService.incrementLoop(currentPoint, path.length);
        if(currentPoint == 0 && !this.loopPath) { // we are done, we have gone to the end of the path.
          this.moveToCenter(logicContext, botInstance, li.getMap().get(nextPoint.x,nextPoint.y)); // lets try and center in the tile
          return;
        }
        nextPoint = path[currentPoint];
        if(nextPoint == null) {
          console.log("Why is this null!"); // TODO handle this correctly, how to push this up the line?
          this.complete(logicContext);
          return;
        }
        logicContext.setLocalVariable(this.currentPointVarId,currentPoint);
        logicContext.setLocalVariable(this.headDirectionVarId, PathfinderService.getHeadingDirection(botInstance.getTileCords(),nextPoint));
        logicContext.removeLocalVariable(this.moveDirectionVarId);
      }

      let nextTile:MapTile = li.getMap().get(nextPoint.x,nextPoint.y);

      this.checkTraversal(logicContext, botInstance, nextTile.getTraverseStatus(),li);
      if ( this.canContinue(logicContext) && this.getStatus(logicContext) === LogicBlockStatus.INPROGRESS ) { // may have been blocked
        // TODO can I move into the target tile?
          // Something may have changed since the path was chosen, perhaps, its now blocked.
            // IF blocked, pathfind again? but not if its going to move out of my way?
              // is it moving?
                // is it heading away from me,
                  // then just wait for it to move away.
                // towards me
                  // then I should move around it, if I can. or turn around,
                  // or just stop, 'say path is blocked here sir'.

        let moveDirection:TurretDirection = this.getOrCreateTurret(logicContext,botInstance, nextTile);
        moveDirection.update(botInstance.getCenterX(),botInstance.getCenterY());

        // TODO facing, the right way, then rotate before moving?

        // Free to move, so move.
        botInstance.posX += moveDirection.speed * moveDirection.directionX;
        botInstance.posY += moveDirection.speed * moveDirection.directionY;

        // TODO what tile am I in now? after moving? Need to update my tile(s)
        if ( LogicService.isPointInRectangle(botInstance.getTopLeftTileCenterCords(),nextTile.getCornerCords()) ) {
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
      }
    } else { // we have no path for whatever reason, so return.
      if(ConfigService.isDebugLogic) console.log("We have no path for whatever reason, completing move to logic");
      this.complete(logicContext);
    }
    //console.log("ID:"+this.logicId + " Complete:" +this.isComplete(logicContext) + " Status:"+this.getStatus(logicContext));
  }

  private checkTraversal(logicContext:LogicContext, bi:BotInstance, traverseStatus: TraverseStatus, li:LevelInstance) {
    if(!traverseStatus.passable) { // hmmm, then we are completely blocked.
      this.blocked(logicContext);
      console.log("ID:"+this.logicId + " Status:"+this.getStatus(logicContext) + " Event: Not passable tile.");
    }
    if(traverseStatus.entityOccupied && traverseStatus.tile.tileEntity !== bi) {
      this.setStatus(logicContext, LogicBlockStatus.BLOCKED);
      // TODO set unblock strageties? // once those are exhausted, we have to end the block in failure.
      logicContext.setLocalVariable(this.logicUnblockStrategiesId,
        [
          // first we just wait, no moving back to center. if the tile clears move into it.
          new WaitLogic(3600,
            (logicContext:LogicContext) => { return !traverseStatus.tile.optTileEntity().isPresent() }
          ),
          // second try and plot a new course to target with reroute.
          // TODO
          // third continue waiting, then move back to center tile as we wait.
          new WaitLogic(3600,
          (logicContext:LogicContext) => { return !traverseStatus.tile.optTileEntity().isPresent() },
          (logicContext:LogicContext) => { let nextTile = li.getMap().get(bi.tileX,bi.tileY);
            let moveDirection =  TurretDirection.calculateTurretDirection(bi.getCenterX(),bi.getCenterY(),nextTile.getCenterX(), nextTile.getCenterY(),2,true);
            if( !(LogicService.isDiffLessThanCalc(bi.getCenterX(),nextTile.getCenterX(),moveDirection.speed) && LogicService.isDiffLessThanCalc(bi.getCenterY(),nextTile.getCenterY(),moveDirection.speed))){
              bi.posX += moveDirection.speed * moveDirection.directionX;
              bi.posY += moveDirection.speed * moveDirection.directionY;
            }
          },
        )])
      console.log("ID:"+this.logicId + " Status:"+this.getStatus(logicContext) + " Event: Tile Occupied by Entity");
    }
  }

  /**
   * Will continue the on the path and center on the targetted tile
   */
  private moveToCenter(logicContext:LogicContext, bi:BotInstance, nextTile: MapTile ): boolean {
    let moveDirection:TurretDirection = this.getOrCreateTurret(logicContext,bi, nextTile);
    if(LogicService.isDiffLessThanCalc(bi.getCenterX(),nextTile.getCenterX(),moveDirection.speed) && LogicService.isDiffLessThanCalc(bi.getCenterY(),nextTile.getCenterY(),moveDirection.speed)){
      console.log("ID:"+this.logicId + " Status:"+this.getStatus(logicContext) + " Event: At center of tile.");
      return this.complete(logicContext); // Complete, finish movement Logic.
    } else { // nudge close to the center of the tile.
      moveDirection.update(bi.getCenterX(),bi.getCenterY());
      bi.posX += moveDirection.speed * moveDirection.directionX;
      bi.posY += moveDirection.speed * moveDirection.directionY;
    }
  }

  getOrCreateTurret(logicContext:LogicContext, bi:BotInstance, nextTile: MapTile ):TurretDirection{
    let moveDirection:TurretDirection = logicContext.getLocalVariable(this.moveDirectionVarId);
    if ( moveDirection == null ) {
      moveDirection =  TurretDirection.calculateTurretDirection(bi.getCenterX(),bi.getCenterY(),nextTile.getCenterX(), nextTile.getCenterY(),2,true);
      logicContext.setLocalVariable(this.moveDirectionVarId, moveDirection);
    }
    return moveDirection;
  }

  private calcPath(logicContext: LogicContext) {
    const bi = logicContext.getBotInstance();
    let pathCal = [];
    let point0 = bi.getTileCords();
    let pointA = point0;
    for(let i = 0; i < this.points.length; i++) {
      let pointB = this.points[i];
      const path = PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap());
      path[path.length-1] = new KeyNode(path[path.length-1],pointB);
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

  /**
   * rerouting will factor in tile entities that might be blocking your path.
   * So it will first find a tile as close to the target tile as possible thats currently free
   * Then plot a course there with tile entities included in the path cal.
   * If its not possible, then back to waiting
   */
  private rerouteFull(logicContext: LogicContext){
    const li = logicContext.levelInstance;
    const {mapSizeX,mapSizeY} = li.getMap().getMapSize();
    const botInstance = logicContext.getBotInstance();

    let pathOpt = logicContext.getLocalVariableOrDefault(this.pathVarId, Opt.empty());
    let path = pathOpt.get();
    let currentPoint = logicContext.getLocalVariableOrDefault(this.currentPointVarId,0);
    let nextPoint = path[currentPoint];
    // Starting from the current node,
    if(currentPoint === path.length) { // we are already on the last node... TODO So complete?

    }

    // next key node
    let nextKeyNode = nextPoint;
    let tmp = currentPoint;
    while(!(nextKeyNode instanceof KeyNode)) {
      tmp++;
      nextKeyNode = path[tmp];
    }

    // find a free tile
    let freeTile = null;
    loop:
    for(let i = 1; i < 5 || freeTile !== null; i++) { // if I cannot get within 5 tiles then its a failed path.
      let botCords = botInstance.getTileCords();
      let distance = 1 + (i*2);
      let startingCords = { x:botCords.x - i, y: botCords.y - i };
      let endingCords = { x:botCords.x + distance, y: botCords.y + distance };

      // brute force it. // TODO refactor for performance.
      let freeTiles = [];
      for(let l = startingCords.x; l < endingCords.x; l++){
        for(let k = startingCords.y; k < endingCords.y; k++){
          if(l >= 0 && k >= 0 && l < mapSizeX && k < mapSizeY){ // boundary check
            if( (l === startingCords.x || l === endingCords.x) && (k === startingCords.y || k === endingCords.y) ){
              const tile = li.getMap().get(l,k);
              if ( !tile.getTraverseStatus().entityOccupied && tile.getTraverseStatus().passable) {
                freeTiles.push(tile);
              }
            }
          }
        }
      }
      // pick a random free tile
      if(freeTiles.length > 0){
        // TODO pick a random one, so bots will split up.
        freeTile = freeTiles[0];
        break loop;
      }
    }
    // TODO did I find a tile? If not, fail the reroute.
    if(freeTile === null) {

    }

    // now I have a freetile, so create a new path from current node to free tile, if that fails, then we just continue to wait.
    // const path = PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap(), true);




    // work out from the path, how many of the previous "points" have been hit. (Key Nodes)
      // now with the points that remain, are they reach able at the moment?
      // if not, expand out one tile, are any of those reach able?, use those as the points for this path calc.
      // Mark certain nodes as key nodes?

    // whats the next keyNode on the path?
      // Can we introduce a new temp sub path?? which when completes, updates the path index up to the next KeyNode?
        // So we reroute between key nodes, not the entire path?

    // So I may have to create a new Logic block, which factors in tile entities
      // It would wrap around a new Move to logic, from current tile to next key node (or as close as possible)
        // On completion, it will update the path index to be one after the next KeyNode, and let the original move path continue again, unblocked.
      // this way the move logic is not affected, and if the path is clear next time, they will take the most direct route.1
      // if literally no path is possible, simply fail.

    // const path = PathfinderService.getSinglePath(pointA.x,pointA.y,pointB.x,pointB.y,logicContext.levelInstance.getMap(), true);

  }
}

/**
 * Used to identify key points in the path for move logic
 * This allows us to determine which points have been hit.
 * The point cords is the targetted point, but it could be occupied, so we might move through a point beside it, which will still represent achieving that target.
 */
export class KeyNode extends MoveNode {
  constructor(node:MoveNode, public pointCords:Cords) {
    super(node.x,node.y,node.n,node.h)
  }


}




