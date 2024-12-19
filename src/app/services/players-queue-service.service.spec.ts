import { TestBed } from '@angular/core/testing';

import { PlayersQueueServiceService } from './players-queue-service.service';

describe('PlayersQueueServiceService', () => {
  let service: PlayersQueueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayersQueueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
