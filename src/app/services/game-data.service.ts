import { Injectable } from '@angular/core';

/**
 * Holds all of the Game data
 * Holds all of the player data, profile configuration
 */
@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  constructor() { }
  // OOS
  // load data, browser Json? Can we really store this much data?
  // save data

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

  constructor(){

  }

  // Update player data with last mission results

}

export class GameData {

  // worlds, status
  // history, houses, races
  // missions
  // companies (rivials, player)
  // shop data
  // game pilots (including player pilots)

  // rig templates?

  constructor(){

  }

  // update world data with last mission results
  // update the world data for passage of a day
}
