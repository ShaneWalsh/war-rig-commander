import { Component, OnInit } from '@angular/core';
import { GameDataService } from 'src/app/services/game-data.service';
import { GameOverivewService } from 'src/app/services/game-overivew.service';

@Component({
  selector: 'app-game-missions',
  templateUrl: './game-missions.component.html',
  styleUrls: ['./game-missions.component.css']
})
export class GameMissionsComponent implements OnInit {

  public missionsAvailable;

  constructor( public gameOverivewService:GameOverivewService, public gameDataService:GameDataService ) { }

  ngOnInit(): void {
    this.missionsAvailable = this.gameDataService.getMissionsAvailable();
  }



}
