import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * For handling menu switching for the game elements.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class GameOverivewService {

  constructor() { }

  public get menuChangeSubject$(): Observable<GameMenus> {
    return this.MenuChangeSubject.asObservable();
  }
  MenuChangeSubject: Subject<GameMenus> = new Subject();
}

// Quests Menu? long running, spanning planets etc?
  // Find someone (espionage), capture them(cap+extract), bring them to Location(travel).
    // how could we be double crossed here? rare 10-20% of the time.
  //

export enum GameMenus {
  GameOverview="GameOverview",
  GameRigEditor="GameRigEditor", // move shit around on the rig, fit more weapons, change engines! How fun.
  GamePilotManagement="GamePilotManagement", // see each pilot details, they naturally learn, get abilities. (pay for specialised training.)
  GameShipManagement="GameShipManagement", // upgrades, maintaince, performance tuning
  GameMissionsAvailable="GameMissionsAvailable", // what missions are currently open to you (location)
  GameMissionPrep="GameMissionPrep", // pick rigs, rig runners, support elements, drop locations
  GameRunner="GameRunner", // switches to the running game
  GameMissionDebrief="GameMissionDebrief" // post mission results, salvage, damage, successes and failures, bonueses.
}
