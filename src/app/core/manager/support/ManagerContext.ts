import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { DisplayManagerService } from '../display-manager.service';
import { EventManagerService } from '../event-manager.service';
import { LevelManagerService } from '../level-manager.service';
import { LogicManagerService } from '../logic-manager.service';

/**
 * All of the managers required for wiring the game togeather
 */
export class ManagerContext {
  constructor(
    public levelMS: LevelManagerService,
    public logicMS: LogicManagerService,
    public displayMS: DisplayManagerService,
    public keyboardEventService: KeyboardEventService,
    public eventManagerService: EventManagerService
  ) {}
}
