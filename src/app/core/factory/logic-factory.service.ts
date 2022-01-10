import { Injectable } from '@angular/core';
import { BotGoal, BotGoalSimple, LogicScenario, LogicSequence } from '../bot/BotGoal';
import { PatrolLogic } from '../bot/logic/LogicBlock';
import { PathfinderService } from '../map/pathfinder.service';

@Injectable({
  providedIn: 'root'
})
export class LogicFactoryService {

  constructor() { }

  public static makePatrol(points:{x,y}[]):BotGoal {
    let patrol = new PatrolLogic(points);
    let seq = new LogicSequence([patrol]);
    let patrolScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(patrolScen,patrolScen);

    return botGoal;
  }

}
