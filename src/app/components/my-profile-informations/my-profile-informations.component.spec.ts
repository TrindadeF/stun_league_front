import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileInformationsComponent } from './my-profile-informations.component';

describe('MyProfileInformationsComponent', () => {
  let component: MyProfileInformationsComponent;
  let fixture: ComponentFixture<MyProfileInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileInformationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProfileInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
