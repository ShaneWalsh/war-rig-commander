import { Component, OnInit } from '@angular/core';
import { GameDataService } from 'src/app/services/game-data.service';
import { MainMenuService, MenusTypes } from 'src/app/services/main-menu.service';

/**
 * This will be the top most menu class, it should wrap the entire game.
 * When a game is launched it will still be contained inside this component.S
 * Cordinate moving between menus and games
 *
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  public activeMenu:MenusTypes = MenusTypes.Main;

  constructor( public mainMenuService:MainMenuService, public gameDataService:GameDataService ) {

  }

  ngOnInit(): void {
    this.mainMenuService.menuChangeSubject$.subscribe((menu:MenusTypes) => {
      this.activeMenu = menu;
    })
  }

  // main menu
  startNewGameHandler() {
    this.gameDataService.startNewGame();
    this.mainMenuService.menuChangeSubject.next(MenusTypes.GameOverview);
  }

}

