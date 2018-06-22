import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { SnakeReducer, FruitsReducer, MetaReducer } from './app.state';
import { GameState } from './types';
import { GameLogicService } from './game-logic.service';

@NgModule({
  declarations: [
    AppComponent,
    GameScreenComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot<GameState>({
      snake: SnakeReducer,
      fruits: FruitsReducer,
      meta: MetaReducer
    }),
    EffectsModule.forRoot([
      GameLogicService
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
