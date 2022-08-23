import { LogicService } from "src/app/services/logic.service";
import { LogicProcess } from "../manager/support/logic/LogicProcess";
import { DrawingContext, LogicContext } from "../manager/support/SharedContext";
import { AbsTileEntity, TileEntity } from "../TileEntity";
import { BotAnimation } from "./util/BotAnimation";



// TODO clickable interface? So when the player clicks on the building, a new UI state is possible?
  // display unit menu, show health, next right click assigns waypoint etc

export interface BotBuilding extends LogicProcess, TileEntity {
  // TODO work out what the building common methods are.

}
