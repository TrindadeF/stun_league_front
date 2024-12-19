import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileHeaderComponent } from './my-profile-header.component';

describe('MyProfileHeaderComponent', () => {
  let component: MyProfileHeaderComponent;
  let fixture: ComponentFixture<MyProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
