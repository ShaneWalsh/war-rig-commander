import { Injectable } from '@angular/core';
import { BotGoal, BotGoalSimple, LogicScenario, LogicSequence } from '../bot/BotGoal';
import { MoveToLogic } from '../bot/logic/movement/MoveToLogic';
import { PatrolLogic } from '../bot/logic/movement/PatrolLogic';

@Injectable({
  providedIn: 'root'
})
export class LogicFactoryService {

  constructor() { }

  public static createPatrol(points:{x,y}[]):BotGoal {
    let patrol = new PatrolLogic(points);
    let seq = new LogicSequence([patrol]);
    let patrolScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(patrolScen,patrolScen);

    return botGoal;
  }

  public static createMoveTo(points:{x,y}[]):BotGoal {
    let move = new MoveToLogic(points);
    let seq = new LogicSequence([move]);
    let moveScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(moveScen,moveScen);

    return botGoal;
  }

}
