import { BotGoal, BotGoalSimple, LogicScenario, LogicSequence } from '../bot/BotGoal';
import { MoveToLogic } from '../bot/logic/movement/MoveToLogic';
import { PatrolLogic } from '../bot/logic/movement/PatrolLogic';
import { SentryLogic } from '../bot/logic/movement/SentryLogic';
import { Cords } from '../Cords';

export class LogicFactory {

  constructor() { }

  public static createSentryScenrio():LogicScenario {
    let sentry = new SentryLogic("Sentry");
    let seq = new LogicSequence([sentry]);
    let sentryScen = new LogicScenario(seq,[]);

    return sentryScen;
  }

  public static createSentry():BotGoal {
    const s = LogicFactory.createSentryScenrio();
    return new BotGoalSimple(s,s);
  }

  public static createPatrol(points:Cords[]):BotGoal {
    let patrol = new PatrolLogic(points);
    let seq = new LogicSequence([patrol]);
    let patrolScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(patrolScen,LogicFactory.createSentryScenrio());

    return botGoal;
  }

  public static createMoveTo(points:Cords[]):BotGoal {
    let move = new MoveToLogic(points);
    let seq = new LogicSequence([move]);
    let moveScen = new LogicScenario(seq,[]);
    let botGoal = new BotGoalSimple(moveScen,LogicFactory.createSentryScenrio());

    return botGoal;
  }

}
