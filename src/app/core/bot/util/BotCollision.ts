import { LogicContext } from "../../manager/support/SharedContext";
import { BotDamage } from "./BotDamage";

export interface BotCollision {

  /**
   * What damage does this bot do on colision?
   */
  collisionDamage(logicContext: LogicContext):BotDamage;

  /**
   * Collision Occured, what happens to the missile?
   * Create little explision? Just vanish?
   * Leave a mark on the ground for a while before fading?
   */
  collisionYouHit(logicContext: LogicContext, hit:BotCollision);

  /**
   * Collision Occured, what happens to the missile?
   * Create little explision? Just vanish?
   * Leave a mark on the ground for a while before fading?
   */
  collisionYouWereHit(logicContext: LogicContext, hit:BotCollision);


}
