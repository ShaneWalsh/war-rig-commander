import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameContainerComponent } from './component/game-container/game-container.component';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { GameOverviewComponent } from './component/game-overview/game-overview.component';
import { GameMissionsComponent } from './component/game-overview/game-missions/game-missions.component';
import { RigHoldComponent } from './component/game-overview/rig-hold/rig-hold.component';
import { RunnerPitComponent } from './component/game-overview/runner-pit/runner-pit.component';

@NgModule({
  declarations: [
    AppComponent,
    GameContainerComponent,
    MainMenuComponent,
    GameOverviewComponent,
    GameMissionsComponent,
    RigHoldComponent,
    RunnerPitComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
