
export enum TeamRelationship {
  ALLIED="ALLIED",
  NEUTRAL="NEUTRAL", // default if no relationship is estabilished.
  ENEMIES="ENEMIES"
}

export interface HasTeam {
  getBotTeam():BotTeam;
}

/**
 * A bot team tells which team this bot is associated with.
 * Teams can be allied with other teams, Neutral or at ENEMIES.
 */
export class BotTeam {

  constructor( public name:String, public playerControlled:boolean ) {

  }

}

export class TeamHandler {
  private relationships:Map<TeamRelationship,RelationshipKey[]> = new Map();

  addRelationship(teamA:BotTeam, teamB:BotTeam, relationship:TeamRelationship){
    if(!this.relationships.has(relationship)){
      this.relationships.set(relationship,[]);
    }
    this.relationships.get(relationship).push(new RelationshipKey(teamA,teamB));
  }

  getRelationship(teamA:BotTeam, teamB:BotTeam):TeamRelationship {
    if(teamA === teamB) return TeamRelationship.ALLIED;
    for(let relationship of this.relationships.keys()){
      let values = this.relationships.get(relationship);
      for(let key of values){
        if(key.isKey(teamA,teamB))
        return relationship;
      }
    }
    return TeamRelationship.NEUTRAL;
  }

  removeRelationship(teamA:BotTeam, teamB:BotTeam){
    for(let relationship of this.relationships.keys()){
      let values = this.relationships.get(relationship);
      for(let key of values){
        if(key.isKey(teamA,teamB)) {
          this.relationships.set(relationship,values.filter(k => k !== key));
          // why not break the loop? because the relationship might be mapped more than once, so lets clean house, remove all traces.
        }
      }
    }
  }

  addOrUpdateRelationship(teamA:BotTeam, teamB:BotTeam, addRelationship:TeamRelationship){
    this.removeRelationship(teamA,teamB);
    this.addRelationship(teamA,teamB,addRelationship);
  }
}

class RelationshipKey {
  constructor(public teamA:BotTeam, public teamB:BotTeam){}
  isKey(teamA:BotTeam, teamB:BotTeam) {
    return (teamA === this.teamA && teamB === this.teamB) || (teamB === this.teamA && teamA === this.teamB);
  }
}

