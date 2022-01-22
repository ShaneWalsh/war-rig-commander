
import { LogicService } from "src/app/services/logic.service";
import { DrawingContext } from "../manager/support/SharedContext";

export interface BotPart {
  draw(drawingContext: DrawingContext)
}

export class DrawTestBotPart implements BotPart {

  draw(dc: DrawingContext) {
    const bi = dc.getBotInstance();
    const uiSet = dc.uiSet;
    LogicService.drawBox( bi.posX-uiSet.curX,
                          bi.posY-uiSet.curY,
                          32,32,dc.cc.groundCtx,
                          '#FFFFFF','#FF00FF')
  }

}
