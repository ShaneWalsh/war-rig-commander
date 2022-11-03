import { Component, OnInit } from '@angular/core';
import { GameDataService, MissionTemplate } from 'src/app/services/game-data.service';
import { GameOverivewService } from 'src/app/services/game-overivew.service';

@Component({
  selector: 'app-game-missions',
  templateUrl: './game-missions.component.html',
  styleUrls: ['./game-missions.component.css']
})
export class GameMissionsComponent implements OnInit {

  public missionsAvailable:MissionTemplate[];
  public selectedMission:MissionTemplate = null;

  constructor( public gameOverivewService:GameOverivewService, public gameDataService:GameDataService ) { }

  ngOnInit(): void {
    this.missionsAvailable = this.gameDataService.getMissionsAvailable();
  }

  selectMission(mission:MissionTemplate){
    this.selectedMission = mission;
  }

}
