import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomKeyboardEvent, KeyboardEventService } from '../../services/keyboard-event.service';

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {
  private gameTickSubject: Subject<boolean> = new Subject();
  private levelLoaded: Subject<LevelInstance> = new Subject();
  private levelComplete: Subject<LevelInstance> = new Subject();

  private currentLevel: LevelInstance;

  private paused = false;

  constructor(private keyboardEventService: KeyboardEventService) {
    keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
      if (this.getNotPaused()){
          //this.currentLevel.processKeyDown(customKeyboardEvent);
      }
    });
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
      if (this.getNotPaused()){
        //this.currentLevel.processKeyUp(customKeyboardEvent);
      }
    });
  }

  initLevel(mapSettings: any){
    this.levelLoaded.next(this.currentLevel);
  }

  update(){

  }

  pauseGame() {
      this.paused = true;
      // this.audioServiceService.stopAllAudio();
  }

  unPauseGame(){
      this.paused = false;
  }

  getCurrentLevel(): LevelInstance{
      return this.currentLevel;
  }

  getPaused(): boolean{
      return this.paused;
  }

  getNotPaused(): boolean{
      return !this.paused;
  }

  getLevelLoadedSubject(): Subject<LevelInstance>{
      return this.levelLoaded;
  }

  getLevelCompleteSubject(): Subject<LevelInstance> {
      return this.levelComplete;
  }

  getGameTickSubject(): Subject<boolean> {
      return this.gameTickSubject;
  }

}

class LevelInstance {


}



