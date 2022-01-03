import { ManagerContext } from "./ManagerContext";

export abstract class LevelInstance {

  constructor(public mc:ManagerContext) {
    this.initLevel();
  }

  public abstract initLevel();
}
