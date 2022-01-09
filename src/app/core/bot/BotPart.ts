
import { LogicService } from "src/app/services/logic.service";
import { DrawingContext } from "../manager/support/SharedContext";

export interface BotPart {
  draw(drawingContext: DrawingContext)
}

export class DrawTestBotPart implements BotPart {

  draw(drawingContext: DrawingContext) {
    const bi = drawingContext.getBotInstance();
    LogicService.drawBox(bi.posX, bi.posY,32,32,drawingContext.cc.groundCtx,'#FFFFFF','#FF00FF')
  }

}
