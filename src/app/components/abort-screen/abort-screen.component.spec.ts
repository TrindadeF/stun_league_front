import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbortScreenComponent } from './abort-screen.component';

describe('AbortScreenComponent', () => {
  let component: AbortScreenComponent;
  let fixture: ComponentFixture<AbortScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbortScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbortScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
