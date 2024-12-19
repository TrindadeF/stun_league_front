import { TestBed } from '@angular/core/testing';

import { WebSocketQueueService } from './web-socket-queue.service';

describe('WebSocketQueueService', () => {
  let service: WebSocketQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
