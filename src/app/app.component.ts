import { Component } from '@angular/core';
import { GameLogicService } from './game-logic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public gls: GameLogicService) { }

  keyPress(key: string) {
    this.gls.keyPress(key);
  }

  loaded() {
    this.gls.initializeGame();
  }
}
