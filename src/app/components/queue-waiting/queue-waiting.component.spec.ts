import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueWaitingComponent } from './queue-waiting.component';

describe('QueueWaitingComponent', () => {
  let component: QueueWaitingComponent;
  let fixture: ComponentFixture<QueueWaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueWaitingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
