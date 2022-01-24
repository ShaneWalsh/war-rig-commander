import { Injectable } from '@angular/core';
import { BotGoal, BotGoalSimple, LogicScenario, LogicSequence } from '../bot/BotGoal';
import { MoveToLogic } from '../bot/logic/movement/MoveToLogic';
import { PatrolLogic } from '../bot/logic/movement/PatrolLogic';
import { SentryLogic } from '../bot/logic/movement/SentryLogic';

@Injectable({
  providedIn: 'root'
})
export class LogicFactoryService {

  constructor() { }

  public static createSentryScenrio():LogicScenario {
    let sentry = new SentryLogic("Sentry");
    let seq = new LogicSequence([sentry]);
    let sentryScen = new LogicScenario(seq,[]);

    return sentryScen;
  }

  public static createSentry():BotGoal {
    const s = LogicFactoryService.createSentryScenrio();
    return new BotGoalSimple(s,s);
  }

  public static createPatrol(points:{x,y}[]):BotGoal {
    let patrol = new PatrolLogic(points);
    let seq = new LogicSequence([patrol]);
    let patrolScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(patrolScen,LogicFactoryService.createSentryScenrio());

    return botGoal;
  }

  public static createMoveTo(points:{x,y}[]):BotGoal {
    let move = new MoveToLogic(points);
    let seq = new LogicSequence([move]);
    let moveScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(moveScen,LogicFactoryService.createSentryScenrio());

    return botGoal;
  }

}
