import { Injectable } from '@angular/core';

/**
 * Holds all of the Game data
 * Holds all of the player data, profile configuration
 */
@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  public playerData:PlayerData;
  public gameData:GameData;

  constructor() { }
  // OOS
  // load data, browser Json? Can we really store this much data?
  // save data

  startNewGame() {
    this.playerData = new PlayerData();
    this.gameData = new GameData();
  }

  getMissionsAvailable() {
    return this.gameData.missionsAvailable;
  }

}

export class PlayerData {

  // player finances
  // pilots (references)
  // rigs
  // inventory
  // company details
  // ship status (upgrades/confguration)
  // location

  // mission prep configuration(set on mission brief screen)

  // divitiae
  constructor(
    public playerPilot:string= "funky",
    public company = new Company(),
    public credits:number=10000
  ){

  }

  // Update player data with last mission results

}

export class Company {
  constructor(
    public name:string="Awesome Crew",
    public reputation:number=100,
    public color1:number=1,
    public color2:number=2,
    public confirmedKills:number=10,
    public missionSuccess:number=20
  ){}
}

export class GameData {

  // worlds, status
  // history, houses, races

  /**
   * A collection of missions, possibly spread across planets, potential for choices by you on outcome, pick sides etc. Double cross options etc.
   */
  public quests
  /**
   * Generated for each world you land on, and as days go on more generate.
   * There can also be missions from other worlds, which will require travel.
   */
  public missionsAvailable
  // companies (rivials, player)
  // shop data
  // game pilots (including player pilots)

  // rig templates?

  constructor(){

  }

  // update world data with last mission results
  // update the world data for passage of a day
}

/**
 * While missions will have a type, they can change mid way through.
 * e.g a battle might seem simple, but perhaps you stumble upon valuable cargo, steal it, get it to an evac point.
 * e.g another merc crew might drop in, an expensive drop, must be an important situation.
 * Bonus Objectives, time, destruction, capturing, minimzing damage
 * Missions can get you caught up in Family fueds, faction fueds and subdrefudge etc.
 */
export enum MissionType {
  // Find the enemy, engage them, extract.
  Battle="Battle"
}

export class MissionTemplate {
// map template?
// When does the map and opps get generated?

// weight restrictions? Putting in weight seems a bit, MC ish.
  constructor(
    public title:string="Mission Name",
    public payment:number=100000,
    public salvage:number=10,// 0-25?
    public favourSwing:number=2, // positive for one faction, negative for another, unless its a spy mission.
    public missionType:MissionType=MissionType.Battle,
    public resistence:number=1, // how hard should this mission be, In theory... 1-10?
    public deployZones:number=1, // 1-3
    // Objectives
    // Story, which faction is fighting which. What are your orders.
  ) {}

}

