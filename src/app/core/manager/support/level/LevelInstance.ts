import { LevelMap } from "../../../map/LevelMap";
import { ManagerContext } from "../ManagerContext";

export abstract class LevelInstance {
  constructor(public mc:ManagerContext) {
    this.initLevel();
  }

  public abstract initLevel();
  public abstract getMap():LevelMap;
}
