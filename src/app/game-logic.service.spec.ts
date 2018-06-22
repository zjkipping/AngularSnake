import { TestBed, inject } from '@angular/core/testing';

import { GameLogicService } from './game-logic.service';

describe('GameLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameLogicService]
    });
  });

  it('should be created', inject([GameLogicService], (service: GameLogicService) => {
    expect(service).toBeTruthy();
  }));
});
