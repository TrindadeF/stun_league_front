import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiCheaterComponent } from './anti-cheater.component';

describe('AntiCheaterComponent', () => {
  let component: AntiCheaterComponent;
  let fixture: ComponentFixture<AntiCheaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntiCheaterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntiCheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
