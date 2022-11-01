import { Component, OnInit } from '@angular/core';
import { GameMenus, GameOverivewService } from 'src/app/services/game-overivew.service';
import { MenusTypes } from 'src/app/services/main-menu.service';

/**
 * Wraps all of the active game elements
 * Menu switching for the game screens.
 * Side/top bar from here which can then wrap all of the game screens, if required.
 *
 */
@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.css']
})
export class GameOverviewComponent implements OnInit {

  public activeMenu:GameMenus = GameMenus.GameOverview;

  constructor(public gameOverivewService:GameOverivewService) { }

  ngOnInit(): void {
    this.gameOverivewService.menuChangeSubject$.subscribe((menu:GameMenus) => {
      this.activeMenu = menu;
    });
  }

}
