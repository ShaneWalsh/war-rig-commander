import { DrawingContext } from "../manager/support/Drawer";
import { BotInstance } from "./BotInstance";

export interface BotPart {
  draw(botInstance:BotInstance, drawingContext: DrawingContext)
}
