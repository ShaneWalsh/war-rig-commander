import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainMenuService {

  constructor() { }

  public get menuChangeSubject$(): Observable<MenusTypes> {
    return this.MenuChangeSubject.asObservable();
  }
  MenuChangeSubject: Subject<MenusTypes> = new Subject();
}

export enum MenusTypes {
  Main="Main",
  NewGame="NewGame",
  Options="Options",
  GameOverview="GameOverview"
}
