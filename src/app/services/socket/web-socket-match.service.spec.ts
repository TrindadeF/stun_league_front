import { TestBed } from '@angular/core/testing';

import { WebSocketMatchService } from './web-socket-match.service';

describe('WebSocketMatchService', () => {
  let service: WebSocketMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
