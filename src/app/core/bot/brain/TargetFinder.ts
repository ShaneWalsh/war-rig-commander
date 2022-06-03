import { LogicContext } from "../../manager/support/SharedContext";
import { MapTile } from "../../map/LevelMap";
import { TileEntity } from "../../TileEntity";
import { BotBrain } from "../BotBrains";
import { TeamRelationship } from "../BotTeam";

export enum TargetVariables {
  AVAILABLE_TARGETS="AVAILABLE_TARGETS",
  CLOSEST_TARGET="CLOSEST_TARGET",
  NETWORKED_ALLIES="NETWORKED_ALLIES",
  NEUTRALS="NEUTRALS",
}

/**
 * Find a target, if there is one already, is it still a valid target?
 * If not, find a new one.
 * Hav secific logic variables it can set and maintain in the context? Put them in as Enums?
 */
 export class TargetFinder implements BotBrain {

  constructor(public range:number) { }

  think(logicContext:LogicContext) {
    const botInstance = logicContext.getBotInstance();
    const li = logicContext.levelInstance;

    let availableTargets:TileEntity[] = [];
    let closestTarget:TileEntity= null;
    let networkedAllies:TileEntity[] = [];
    let neutrals:TileEntity[] = [];

    // get every bot within my sensor range
    // determine their team relationship to me, bucket them
    // keep track of the closest target always.
    let tiles:MapTile[] = li.getMap().getTilesWithinSensor(this.range, botInstance.getTileCords());
    tiles.forEach(tile => {
      if ( tile.optTileEntity().isPresent() ) {
        let entity = tile.optTileEntity().get();
        if(entity !== botInstance) {
          let rel:TeamRelationship = li.getTeamHandler().getRelationship(botInstance.getBotTeam(), entity.getBotTeam());
          if(rel === TeamRelationship.ENEMIES) {
            availableTargets.push(entity);
            closestTarget = entity; // TODO create logic to check the distances.
          } else if(rel === TeamRelationship.ALLIED) {
            networkedAllies.push(entity);
          } else {
            neutrals.push(entity);
          }
        }
      }
    });

    logicContext.setLocalVariable(TargetVariables.AVAILABLE_TARGETS, availableTargets);
    logicContext.setLocalVariable(TargetVariables.CLOSEST_TARGET, closestTarget);
    logicContext.setLocalVariable(TargetVariables.NETWORKED_ALLIES, networkedAllies);
    logicContext.setLocalVariable(TargetVariables.NEUTRALS, neutrals);
  }
}