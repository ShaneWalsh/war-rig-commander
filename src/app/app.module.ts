import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameContainerComponent } from './component/game-container/game-container.component';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { GameOverviewComponent } from './component/game-overview/game-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    GameContainerComponent,
    MainMenuComponent,
    GameOverviewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
